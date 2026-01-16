<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Display the laporan page.
     */
    public function index(): Response
    {
        $financialAccounts = FinancialAccount::where('is_active', true)->get();
 
        $totalAssetValas = \App\Models\Currencies::all()->sum(function ($currency) {
            return $currency->stock_amount * $currency->average_rate;
        });

        $transactions = \App\Models\Transactions::orderBy('id', 'ASC')
            ->with(['user', 'currency', 'financialAccount'])
            ->limit(50)
            ->get()
            ->map(function ($trx) {
                return [
                    'id' => $trx->id,
                    'time' => $trx->created_at->translatedFormat('d M Y H:i'),
                    'type' => $trx->invoice_number,
                    'formatted_time' => $trx->created_at->toISOString(),
                    'invoice_number' => $trx->invoice_number,
                    'transaction_type' => $trx->type,
                    'customer' => $trx->customer_name,
                    'currency_code' => $trx->currency->code,
                    'rate' => $trx->rate,
                    'payment_method' => $trx->financialAccount->type,
                    'total_idr' => $trx->total_idr,
                    'user_name' => $trx->user->name,
                    'amount_valas' => $trx->amount,
                ];
            });

        return Inertia::render('Laporan/Index', [
            'financialAccounts' => $financialAccounts,
            'totalAssetValas' => $totalAssetValas,
            'transactions' => $transactions,
        ]);
    }
}
