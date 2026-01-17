<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Display the laporan page.
     */
    public function index(Request $request): Response
    {
        $date = $request->input('date', now()->toDateString());
        
        $financialAccounts = FinancialAccount::where('is_active', true)->get();
        
        $saldoAwalCash = $financialAccounts->where('type', 'cash')->sum('balance');
        $saldoAwalBca = $financialAccounts->whereIn('type', ['bca', 'bca2'])->sum('balance');
        $saldoAwalMandiri = $financialAccounts->whereIn('type', ['mandiri', 'mandiri2'])->sum('balance');

        $todaysTransactions = Transactions::with(['user', 'currency', 'financialAccount'])
            ->whereDate('created_at', $date)
            ->get();

        $mutations = [
            'salesCash' => 0, 'buyCash' => 0,
            'salesBca' => 0, 'buyBca' => 0,
            'salesMandiri' => 0, 'buyMandiri' => 0,
        ];

        foreach ($todaysTransactions as $trx) {
            $nominal = (float) $trx->total_idr;
            $type = $trx->type;
            
            $accountType = $trx->financialAccount ? $trx->financialAccount->type : '';
            
            if ($accountType === 'cash') {
                if ($type === 'sell') $mutations['salesCash'] += $nominal;
                if ($type === 'buy') $mutations['buyCash'] += $nominal;
            } elseif (Str::contains($accountType, 'bca')) {
                if ($type === 'sell') $mutations['salesBca'] += $nominal;
                if ($type === 'buy') $mutations['buyBca'] += $nominal;
            } elseif (Str::contains($accountType, 'mandiri')) {
                if ($type === 'sell') $mutations['salesMandiri'] += $nominal;
                if ($type === 'buy') $mutations['buyMandiri'] += $nominal;
            }
        }

        $totalBuy = $mutations['buyCash'] + $mutations['buyBca'] + $mutations['buyMandiri'];
        $totalSales = $mutations['salesCash'] + $mutations['salesBca'] + $mutations['salesMandiri'];

        $totalAssetValas = \App\Models\Currencies::all()->sum(function ($currency) {
            return $currency->stock_amount * $currency->average_rate;
        });

        $history = $todaysTransactions->sortBy('id')->values()->map(function ($trx) {
             return [
                'id' => $trx->id,
                'time' => $trx->created_at->translatedFormat('d M Y H:i'),
                'type' => $trx->invoice_number,
                'formatted_time' => $trx->created_at->toISOString(),
                'invoice_number' => $trx->invoice_number,
                'transaction_type' => $trx->type,
                'customer' => $trx->customer_name,
                'currency_code' => $trx->currency ? $trx->currency->code : '???',
                'rate' => $trx->rate,
                'payment_method' => $trx->financialAccount ? $trx->financialAccount->type : 'uknown',
                'total_idr' => $trx->total_idr,
                'user_name' => $trx->user ? $trx->user->name : 'Unknown',
                'amount_valas' => $trx->amount,
            ];
        });

        return Inertia::render('Laporan/Index', [
            'date' => $date,
            'reportData' => [
                'saldo_awal' => [
                    'cash' => $saldoAwalCash,
                    'bca' => $saldoAwalBca,
                    'mandiri' => $saldoAwalMandiri,
                ],
                'mutations' => $mutations,
                'totals' => [
                    'buy' => $totalBuy,
                    'sales' => $totalSales,
                    'asset_valas' => $totalAssetValas,
                ],
                'transactions' => $history
            ]
        ]);
    }
}
