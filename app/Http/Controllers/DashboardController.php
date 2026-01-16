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

        return Inertia::render('Dashboard', [
            'financialAccounts' => $financialAccounts,
            'recentTransactions' => $transactions
        ]);
    }
}
