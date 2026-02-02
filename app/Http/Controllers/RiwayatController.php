<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use App\Models\NotaLayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use App\Models\InvoiceTemplate;

class RiwayatController extends Controller
{
    public function index(Request $request)
    {
        // ✅ ambil daftar kolom yang benar-benar ada di tabel transactions
        $existingColumns = Schema::getColumnListing('transactions');

        // ✅ daftar kolom yang lu butuhin (tapi bisa aja belum ada di DB)
        $wantedColumns = [
            'id',
            'invoice_number',
            'template_id',
            'currency_id',
            'amount',
            'rate',
            'total_idr',
            'customer_name',
            'payment_method',
            'type',
            'user_id',
            'financial_account_id',
            'created_at',
        ];

        // ✅ filter: ambil hanya kolom yang ada di DB
        $selectColumns = array_values(array_intersect($wantedColumns, $existingColumns));

        $query = Transactions::query()
            ->select($selectColumns)
            ->with([
                'currency',
                'user:id,name',
                'financialAccount:id,type',
            ]);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type') && in_array($request->type, ['buy', 'sell'])) {
            $query->where('type', $request->type);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $transactions = $query->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        // ✅ ambil layout nota dari DB untuk user login
        $userId = auth()->id();

        $notaLayouts = NotaLayout::where('user_id', $userId)
            ->select(['id', 'template_id', 'layout'])
            ->get();

        // ✅ samain nama relasi biar di React jadi `financial_account`
        $transactions->getCollection()->transform(function ($trx) {
            $trx->financial_account = $trx->financialAccount ?? null;
            unset($trx->financialAccount);

            // ✅ kalau kolom template_id ga ada di DB, biar aman di React
            if (!isset($trx->template_id)) {
                $trx->template_id = 1;
            }

            // ✅ kalau payment_method ga ada di DB, biar aman di React
            if (!isset($trx->payment_method)) {
                $trx->payment_method = null;
            }

            return $trx;
        });

        return Inertia::render('Riwayat/Index', [
            'transactions' => $transactions,
            'notaLayouts'      => $notaLayouts,
            'invoiceTemplate'  => InvoiceTemplate::first(),
            'filters' => $request->only([
                'search',
                'type',
                'start_date',
                'end_date',
            ]),
            'notaLayouts' => $notaLayouts,
        ]);
    }

    public function print(Transactions $transaction)
    {
        $transaction->load([
            'currency',
            'user:id,name',
            'financialAccount:id,type',
        ]);

        // ✅ samain nama relasi juga untuk print
        $transaction->financial_account = $transaction->financialAccount ?? null;
        unset($transaction->financialAccount);

        // ✅ fallback aman kalau kolomnya belum ada
        if (!isset($transaction->template_id)) {
            $transaction->template_id = 1;
        }

        if (!isset($transaction->payment_method)) {
            $transaction->payment_method = null;
        }

        $userId = auth()->id();

        $notaLayouts = NotaLayout::where('user_id', $userId)
            ->select(['id', 'template_id', 'layout'])
            ->get();

        return Inertia::render('Riwayat/Print', [
            'transaction' => $transaction,
            'notaLayouts' => $notaLayouts,
            'invoiceTemplate' => InvoiceTemplate::first(),
        ]);
    }
}
