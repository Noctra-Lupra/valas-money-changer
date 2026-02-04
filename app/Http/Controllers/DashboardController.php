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
             $transactions = Transactions::whereDate('created_at', $date)
                ->orderBy('created_at', 'ASC')
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
                $openingBalances = [
                    'cash' => $yesterdayClosing->cash_ending_balance,
                    'bca' => $yesterdayClosing->bca_ending_balance,
                    'mandiri' => $yesterdayClosing->mandiri_ending_balance,
                ];
             } else {
                $openingBalances = [
                    'cash' => $financialAccounts->where('type', 'cash')->sum('balance'),
                    'bca' => $financialAccounts->filter(fn($acc) => str_contains(strtolower($acc->type), 'bca'))->sum('balance'),
                    'mandiri' => $financialAccounts->filter(fn($acc) => str_contains(strtolower($acc->type), 'mandiri'))->sum('balance'),
                ];
             }
        }

        $todaysTrxRaw = Transactions::whereDate('created_at', $date)->get();
        $transactionCounts = [
            'buy' => $todaysTrxRaw->where('type', 'buy')->count(),
            'sell' => $todaysTrxRaw->where('type', 'sell')->count(),
            'total' => $todaysTrxRaw->count(),
        ];

        return Inertia::render('Dashboard', [
            'financialAccounts' => $financialAccounts,
            'recentTransactions' => $transactions,
            'yesterdayGrandTotal' => $yesterdayGrandTotal,
            'todayClosing' => $todayClosing,
            'openingBalances' => $openingBalances,
            'transactionCounts' => $transactionCounts,
        ]);
    }
}
