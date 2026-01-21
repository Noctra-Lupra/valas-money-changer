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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
        ]);

        $accountType = match ($validated['payment_method']) {
            'bca' => 'bca',
            'bca2' => 'bca2',
            'mandiri' => 'mandiri',
            'mandiri2' => 'mandiri2',
            default => 'cash',
        };

        $account = FinancialAccount::where('type', $accountType)->first();
        if (!$account) {
            return back()->withErrors(['payment_method' => 'Akun finansial tidak ditemukan for type: ' . $accountType]);
        }

        \App\Models\OperationalEntry::create([
            'user_id' => auth()->id(),
            'financial_account_id' => $account->id,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
        ]);

        return back()->with('success', 'Data operasional berhasil disimpan.');
    }

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
     
        $opsEntries = \App\Models\OperationalEntry::with('financialAccount')
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

        $opsSummary = [
            'cash_in' => 0, 'cash_out' => 0,
            'bca_in' => 0, 'bca_out' => 0,
            'mandiri_in' => 0, 'mandiri_out' => 0,
            
            'transfer_from_bank_to_cash' => 0, 
            'transfer_to_bank' => 0,
            'ghost_adjustment' => 0, 
        ];

        foreach ($opsEntries as $op) {
            $amt = (float) $op->amount;
            $ftype = $op->financialAccount->type; 

            if ($ftype === 'cash') {
                if ($op->type === 'in') $opsSummary['cash_in'] += $amt;
                else $opsSummary['cash_out'] += $amt;
            } 

            elseif (in_array($ftype, ['bca', 'mandiri'])) {
                if ($op->type === 'in') {
                    if ($ftype === 'bca') $opsSummary['bca_in'] += $amt;
                    else $opsSummary['mandiri_in'] += $amt;
  
                    $opsSummary['transfer_to_bank'] += $amt; 
                } 
                else {
                    if ($ftype === 'bca') $opsSummary['bca_out'] += $amt;
                    else $opsSummary['mandiri_out'] += $amt;

                    $opsSummary['transfer_from_bank_to_cash'] += $amt; 
                }
            }

            elseif (in_array($ftype, ['bca2', 'mandiri2'])) {
                if (Str::contains($ftype, 'bca')) {
                    if ($op->type === 'in') $opsSummary['bca_in'] += $amt;
                    else $opsSummary['bca_out'] += $amt;
                } else {
                    if ($op->type === 'in') $opsSummary['mandiri_in'] += $amt;
                    else $opsSummary['mandiri_out'] += $amt;
                }

                if ($op->type === 'in') {
                    $opsSummary['ghost_adjustment'] -= $amt;
                } else {
                    $opsSummary['ghost_adjustment'] += $amt;
                }
            }
        }

        $totalBuy = $mutations['buyCash'] + $mutations['buyBca'] + $mutations['buyMandiri'];
        $totalSales = $mutations['salesCash'] + $mutations['salesBca'] + $mutations['salesMandiri'];

        $totalAssetValas = \App\Models\Currencies::all()->sum(function ($currency) {
            return $currency->stock_amount * $currency->average_rate;
        });
        
        $opsHistory = $opsEntries->map(function ($op) {
             return [
                'id' => 'ops-'.$op->id,
                'time' => $op->created_at->translatedFormat('d M Y H:i'),
                'type' => 'OPERATIONAL', 
                'formatted_time' => $op->created_at->toISOString(),
                'invoice_number' => $op->type === 'in' ? 'IN-OPS' : 'OUT-OPS',
                'transaction_type' => $op->type, 
                'customer' => $op->description,
                'currency_code' => 'IDR',
                'rate' => 1,
                'payment_method' => strtoupper($op->financialAccount->type),
                'total_idr' => $op->amount,
                'user_name' => $op->user ? $op->user->name : 'Unknown',
                'amount_valas' => 0,
                'is_operational' => true,
            ];
        });

        $combinedHistory = $todaysTransactions->map(function ($trx) {
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
                'payment_method' => $trx->financialAccount ? $trx->financialAccount->type : 'unknown',
                'total_idr' => $trx->total_idr,
                'user_name' => $trx->user ? $trx->user->name : 'Unknown',
                'amount_valas' => $trx->amount,
                'is_operational' => false,
            ];
        });

        $mergedHistory = $combinedHistory->concat($opsHistory)->sortByDesc('formatted_time')->values();

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
                'transactions' => $mergedHistory, 
                'ops' => $opsSummary
            ]
        ]);
    }
}
