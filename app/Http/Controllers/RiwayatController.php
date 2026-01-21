<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatController extends Controller
{
    public function index(Request $request)
    {
        $query = Transactions::with(['currency', 'user', 'financialAccount']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('type') && in_array($request->type, ['buy', 'sell'])) {
            $query->where('type', $request->type);
        }

        $transactions = $query->OrderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Riwayat/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function print(Transactions $transaction)
    {
        $transaction->load(['currency', 'user', 'financialAccount']);
        return Inertia::render('Riwayat/Print', [
            'transaction' => $transaction
        ]);
    }
}
