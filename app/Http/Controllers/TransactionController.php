<?php

namespace App\Http\Controllers;

use App\Models\Currencies;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transactions;

class TransactionController extends Controller
{
    public function index()
    {
        $currencies = Currencies::orderBy('code', 'asc')->get();

        return Inertia::render('Transaksi/Index', [
            'currencies' => $currencies
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'currency_id' => 'required|exists:currencies,id',
            'type' => 'required|in:buy,sell',
            'amount' => 'required|numeric|min:1',
            'rate' => 'required|numeric|min:1',
            'customer_name' => 'required|string|max:255',
            'payment_method' => 'required|string',
        ]);

        $currency = Currencies::findOrFail($validated['currency_id']);
        $amount = $validated['amount'];
        $rate = $validated['rate'];
        $totalIDR = $amount * $rate;

        $paymentMethod = $validated['payment_method'];
        $accountQuery = \App\Models\FinancialAccount::query();

        if ($paymentMethod === 'cash') {
            $accountQuery->where('type', 'cash');
        } elseif ($paymentMethod === 'bca') {
            $accountQuery->where('type', 'bca');
        } elseif ($paymentMethod === 'mandiri') {
            $accountQuery->where('type', 'mandiri');
        }

        $account = $accountQuery->first();

        if (!$account) {
            return back()->withErrors(['payment_method' => 'Akun keuangan tidak ditemukan untuk metode ini!']);
        }

        if ($validated['type'] === 'buy') {
            $openingBalance = $account->balance;

            $todaysTransactions = Transactions::where('financial_account_id', $account->id)
                ->whereDate('created_at', now()->toDateString())
                ->get();

            $totalIn = $todaysTransactions->where('type', 'sell')->sum('total_idr');
            $totalOut = $todaysTransactions->where('type', 'buy')->sum('total_idr');

            $currentRealBalance = $openingBalance + $totalIn - $totalOut;

            if ($currentRealBalance < $totalIDR) {
                return back()->withErrors(['amount' => "Saldo tidak cukup! Saldo saat ini (Saldo Awal + Transaksi Hari Ini): Rp " . number_format($currentRealBalance, 0, ',', '.')]);
            }
        }

        if ($validated['type'] === 'buy') {
            $soldQtyToday = Transactions::where('currency_id', $currency->id)
                ->where('type', 'sell')
                ->whereDate('created_at', now()->toDateString())
                ->sum('amount');

            $currentStockValue = $currency->stock_amount * $currency->average_rate;
            $soldStockValue    = $soldQtyToday * $currency->average_rate;

            $newPurchaseValue  = $amount * $rate;

            $totalValue = $currentStockValue + $soldStockValue + $newPurchaseValue;

            $totalQtyAccumulated = $currency->stock_amount + $soldQtyToday + $amount;

            if ($totalQtyAccumulated > 0) {
                $newAverageRate = $totalValue / $totalQtyAccumulated;
                $currency->average_rate = $newAverageRate;
            }

            $currency->stock_amount += $amount;
            $currency->save();
        } else {
            if ($currency->stock_amount < $amount) {
                return back()->withErrors(['amount' => 'Stok valas tidak mencukupi!']);
            }
            $currency->stock_amount -= $amount;
            $currency->save();
        }

        $profit = 0;
        $cogs = 0;

        if ($validated['type'] === 'sell') {
            $cogs = $currency->average_rate;
            $profit = ($rate - $cogs) * $amount;
        } else {
            $cogs = $rate;
            $profit = 0;
        }

        $today = now()->format('Ymd');
        $countToday = Transactions::whereDate('created_at', now())->count();
        $invoiceNumber = 'TRX-' . $today . '-' . str_pad($countToday + 1, 3, '0', STR_PAD_LEFT);

        Transactions::create([
            'invoice_number' => $invoiceNumber,
            'user_id' => auth()->id(),
            'currency_id' => $validated['currency_id'],
            'financial_account_id' => $account->id,
            'type' => $validated['type'],
            'customer_name' => $validated['customer_name'],
            'rate' => $rate,
            'amount' => $amount,
            'total_idr' => $totalIDR,
            'cost_of_good_sold' => $cogs,
            'profit' => $profit,
            // 'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Transaksi berhasil disimpan!');
    }

    public function quickStoreCurrency(Request $request)
    {
        try {
            $validated = $request->validate([
                'code' => 'required|string|max:5|unique:currencies,code',
            ]);

            $currency = Currencies::create([
                'code' => strtoupper($validated['code']),
                'name' => '-',
                'variant' => '-',
                'stock_amount' => 0,
                'average_rate' => 0,
            ]);

            return response()->json($currency, 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
