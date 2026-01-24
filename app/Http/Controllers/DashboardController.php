<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\Transactions;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page.
     */
    public function index()
    {
        $financialAccounts = FinancialAccount::all();
        $date = now()->toDateString();
        
        $todayClosing = \App\Models\DailyClosing::where('report_date', $date)->first();
        
        $openingBalances = [
            'cash' => 0,
            'bca' => 0,
            'mandiri' => 0,
        ];

        if ($todayClosing) {
            // If shift matches today, the opening balance for the NEXT shift (or current view) 
            // is the ENDING balance of the closed shift.
            $openingBalances = [
                'cash' => $todayClosing->cash_ending_balance,
                'bca' => $todayClosing->bca_ending_balance,
                'mandiri' => $todayClosing->mandiri_ending_balance,
            ];
            
             // Shift Closed for Today
             $transactions = collect([]);
             $yesterdayGrandTotal = $todayClosing->grand_total;
        } else {
             // Shift Open
             $transactions = Transactions::orderBy('id', 'ASC')
                ->limit(10)
                ->get()
                ->map(function ($trx) {
                    return [
                        'id' => $trx->id,
                        'code' => $trx->invoice_number,
                        'date' => $trx->created_at->toISOString(),
                        'customer' => $trx->customer_name,
                        'currency' => $trx->currency ? $trx->currency->code : '-',
                        'type' => $trx->type,
                        'total' => 'Rp ' . number_format($trx->total_idr, 0, ',', '.'),
                    ];
                });

             $yesterdayClosing = \App\Models\DailyClosing::where('report_date', '<', $date)
                ->orderBy('report_date', 'desc')
                ->first();
             $yesterdayGrandTotal = $yesterdayClosing ? $yesterdayClosing->grand_total : 0;

             if ($yesterdayClosing) {
                // If previous shift exists, its ENDING balance is today's OPENING balance
                $openingBalances = [
                    'cash' => $yesterdayClosing->cash_ending_balance,
                    'bca' => $yesterdayClosing->bca_ending_balance,
                    'mandiri' => $yesterdayClosing->mandiri_ending_balance,
                ];
             } else {
                // Fallback for very first run or no history
                // Provide aggregated balances from FinancialAccount as a starting point
                $openingBalances = [
                    'cash' => $financialAccounts->where('type', 'cash')->sum('balance'),
                    'bca' => $financialAccounts->filter(fn($acc) => str_contains(strtolower($acc->type), 'bca'))->sum('balance'),
                    'mandiri' => $financialAccounts->filter(fn($acc) => str_contains(strtolower($acc->type), 'mandiri'))->sum('balance'),
                ];
             }
        }

        return Inertia::render('Dashboard', [
            'financialAccounts' => $financialAccounts,
            'recentTransactions' => $transactions,
            'yesterdayGrandTotal' => $yesterdayGrandTotal,
            'todayClosing' => $todayClosing,
            'openingBalances' => $openingBalances,
        ]);
    }
}
