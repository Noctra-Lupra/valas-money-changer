<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\Transactions;
use App\Models\DailyClosing;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class LaporanController extends Controller
{
    public function endShift(Request $request)
    {
        $date = now()->toDateString();

        if (DailyClosing::where('report_date', $date)->exists()) {
             return back()->withErrors(['message' => 'Shift hari ini sudah ditutup!']);
        }

        $financialAccounts = FinancialAccount::where('is_active', true)->get();
        $saldoAwalCash = $financialAccounts->where('type', 'cash')->sum('balance');
        $saldoAwalBca = $financialAccounts->whereIn('type', ['bca', 'bca2'])->sum('balance');
        $saldoAwalMandiri = $financialAccounts->whereIn('type', ['mandiri', 'mandiri2'])->sum('balance');

        $todaysTransactions = Transactions::with(['financialAccount'])
            ->whereDate('created_at', $date)
            ->get();

        $opsEntries = \App\Models\OperationalEntry::with('financialAccount')
            ->whereDate('created_at', $date)
            ->get();

        $mutations = [
            'salesCash' => 0,
            'buyCash' => 0,
            'salesBca' => 0,
            'buyBca' => 0,
            'salesMandiri' => 0,
            'buyMandiri' => 0,
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
                } else {
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

                if ($op->type === 'in') $opsSummary['ghost_adjustment'] -= $amt;
                else $opsSummary['ghost_adjustment'] += $amt;
            }
        }

        $saldoAkhirKas = $saldoAwalCash + $mutations['salesCash'] - $mutations['buyCash'] + $opsSummary['cash_in'] - $opsSummary['cash_out'];
        
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
                } else {
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
                
                if ($op->type === 'in') $opsSummary['ghost_adjustment'] -= $amt;
                else $opsSummary['ghost_adjustment'] += $amt;
            }
        }

        $saldoAkhirKas = $saldoAwalCash 
            + $mutations['salesCash'] 
            - $mutations['buyCash'] 
            + $opsSummary['cash_in'] 
            - $opsSummary['cash_out'] 
            + $opsSummary['transfer_from_bank_to_cash'] 
            - $opsSummary['transfer_to_bank'];

        $saldoAkhirBca = $saldoAwalBca 
            + $mutations['salesBca'] 
            - $mutations['buyBca'] 
            + $opsSummary['bca_in'] 
            - $opsSummary['bca_out'];

        $saldoAkhirMandiri = $saldoAwalMandiri
            + $mutations['salesMandiri'] 
            - $mutations['buyMandiri'] 
            + $opsSummary['mandiri_in'] 
            - $opsSummary['mandiri_out'];

        $totalSaldoAkhir = $saldoAkhirKas + $saldoAkhirBca + $saldoAkhirMandiri + $opsSummary['ghost_adjustment'];
        
        $totalAssetValas = \App\Models\Currencies::all()->sum(function ($currency) {
            return $currency->stock_amount * $currency->average_rate;
        });

        $grandTotal = $totalSaldoAkhir + $totalAssetValas;

        $yesterdayClosing = DailyClosing::where('report_date', '<', $date)
            ->orderBy('report_date', 'desc')
            ->first();
        $grandTotalKemarin = $yesterdayClosing ? $yesterdayClosing->grand_total : 0;
        
        $netProfit = $grandTotal - $grandTotalKemarin;

        DB::transaction(function () use ($date, $saldoAwalCash, $mutations, $saldoAkhirKas,
                                         $saldoAwalBca, $saldoAkhirBca, $saldoAwalMandiri, 
                                         $saldoAkhirMandiri, $grandTotal, $netProfit, 
                                         $totalAssetValas, $opsSummary) {
    
            DailyClosing::create([
                'report_date' => $date,
                'cash_opening_balance' => $saldoAwalCash,
                'cash_sales' => $mutations['salesCash'],
                'cash_buy' => $mutations['buyCash'],
                'cash_ending_balance' => $saldoAkhirKas,
                
                'bca_opening_balance' => $saldoAwalBca,
                'bca_mutation_in' => $mutations['salesBca'] + $opsSummary['bca_in'],
                'bca_mutation_out' => $mutations['buyBca'] + $opsSummary['bca_out'],
                'bca_ending_balance' => $saldoAkhirBca,

                'mandiri_opening_balance' => $saldoAwalMandiri,
                'mandiri_mutation_in' => $mutations['salesMandiri'] + $opsSummary['mandiri_in'],
                'mandiri_mutation_out' => $mutations['buyMandiri'] + $opsSummary['mandiri_out'],
                'mandiri_ending_balance' => $saldoAkhirMandiri,

                'total_buy_transaction' => $mutations['buyCash'] + $mutations['buyBca'] + $mutations['buyMandiri'],
                'total_sales_transaction' => $mutations['salesCash'] + $mutations['salesBca'] + $mutations['salesMandiri'],
                
                'total_money_balance' => $saldoAkhirKas + $saldoAkhirBca + $saldoAkhirMandiri, 
                
                'total_valas_balance' => $totalAssetValas,
                'grand_total' => $grandTotal,
                'net_profit' => $netProfit,
            ]);

             $accounts = FinancialAccount::all()->keyBy('id');
             $accountBalances = $accounts->map->balance; 

             $txs = Transactions::whereDate('created_at', $date)->get();
             foreach ($txs as $tx) {
                 if ($tx->type == 'sell') { 
                     $accountBalances[$tx->financial_account_id] += $tx->total_idr;
                 } else { 
                     $accountBalances[$tx->financial_account_id] -= $tx->total_idr;
                 }
             }
             
             $ops = \App\Models\OperationalEntry::whereDate('created_at', $date)->get();
             foreach ($ops as $op) {
                 if ($op->type == 'in') {
                     $accountBalances[$op->financial_account_id] += $op->amount;
                 } else {
                     $accountBalances[$op->financial_account_id] -= $op->amount;
                 }
             }

             foreach ($accountBalances as $id => $bal) {
                 FinancialAccount::where('id', $id)->update(['balance' => $bal]);
             }
        });

        Auth::logout();
        
        return redirect()->route('login')->with('status', 'Shift ended. See you tomorrow!');
    }

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

        $entryDate = now();
        if (\App\Models\DailyClosing::where('report_date', $entryDate->toDateString())->exists()) {
            $entryDate = $entryDate->addDay()->startOfDay();
        }

        \App\Models\OperationalEntry::create([
            'created_at' => $entryDate,
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
        $dateParam = $request->input('date');
        $today = now()->toDateString();
        
        if (!$dateParam && DailyClosing::where('report_date', $today)->exists()) {
             $date = now()->addDay()->toDateString();
        } else {
             $date = $dateParam ?? $today;
        }
        
        $dailyClosing = DailyClosing::where('report_date', $date)->first();

        $todaysTransactions = Transactions::with(['user', 'currency', 'financialAccount'])
            ->whereDate('created_at', $date)
            ->get();
     
        $opsEntries = \App\Models\OperationalEntry::with('financialAccount')
            ->whereDate('created_at', $date)
            ->get();

        $opsHistory = $opsEntries->map(function ($op) {
            return [
                'id' => 'ops-' . $op->id,
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

        $mergedHistory = $combinedHistory
            ->concat($opsHistory)
            ->sortByDesc('formatted_time')
            ->values();

        $perPage = 10;
        $page = request()->get('page', 1);

        $paginatedTransactions = new LengthAwarePaginator(
            $mergedHistory->forPage($page, $perPage),
            $mergedHistory->count(),
            $perPage,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );


        if ($dailyClosing) {
            $reportData = [
                'saldo_awal' => [
                    'cash' => $dailyClosing->cash_opening_balance,
                    'bca' => $dailyClosing->bca_opening_balance,
                    'mandiri' => $dailyClosing->mandiri_opening_balance,
                ],
                'mutations' => [
                    'salesCash' => $dailyClosing->cash_sales, 
                    'buyCash' => $dailyClosing->cash_buy,
                    'salesBca' => $dailyClosing->bca_mutation_in, 
                    'buyBca' => $dailyClosing->bca_mutation_out,
                    'salesMandiri' => $dailyClosing->mandiri_mutation_in,
                    'buyMandiri' => $dailyClosing->mandiri_mutation_out,
                ],
                'totals' => [
                    'buy' => $dailyClosing->total_buy_transaction,
                    'sales' => $dailyClosing->total_sales_transaction,
                    'total_money' => $dailyClosing->total_money_balance,
                    'asset_valas' => $dailyClosing->total_valas_balance,
                ],
                'ops' => [
                     'cash_in' => 0, 
                ],
                'transactions' => $paginatedTransactions,
                'saldo_akhir' => [
                    'cash' => $dailyClosing->cash_ending_balance,
                    'bca' => $dailyClosing->bca_ending_balance,
                    'mandiri' => $dailyClosing->mandiri_ending_balance,
                ],
            ];

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
                        $opsSummary['transfer_to_bank'] += $amt; // RESTORED
                    } else {
                        if ($ftype === 'bca') $opsSummary['bca_out'] += $amt;
                        else $opsSummary['mandiri_out'] += $amt;
                        $opsSummary['transfer_from_bank_to_cash'] += $amt; // RESTORED
                    }
                }
            }
            $reportData['ops'] = $opsSummary;
            
            $reportData['mutations']['salesBca'] = $dailyClosing->bca_mutation_in - $opsSummary['bca_in'];
            $reportData['mutations']['buyBca'] = $dailyClosing->bca_mutation_out - $opsSummary['bca_out'];
            $reportData['mutations']['salesMandiri'] = $dailyClosing->mandiri_mutation_in - $opsSummary['mandiri_in'];
            $reportData['mutations']['buyMandiri'] = $dailyClosing->mandiri_mutation_out - $opsSummary['mandiri_out'];

            $grandTotalHariIni = $dailyClosing->grand_total;
            $yesterdayGrandTotal = $grandTotalHariIni - $dailyClosing->net_profit;

            return Inertia::render('Laporan/Index', [
                'date' => $date,
                'reportData' => $reportData,
                'grandTotalHariIni' => $grandTotalHariIni,
                'yesterdayGrandTotal' => $yesterdayGrandTotal,
                'isClosed' => true,
            ]);

        } else {
            $prevDate = \Carbon\Carbon::parse($date)->subDay()->toDateString();
            $prevClosing = DailyClosing::where('report_date', $prevDate)->first();

            if ($prevClosing) {
                $saldoAwalCash = $prevClosing->cash_ending_balance;
                $saldoAwalBca = $prevClosing->bca_ending_balance;
                $saldoAwalMandiri = $prevClosing->mandiri_ending_balance;
            } else {
                $financialAccounts = FinancialAccount::where('is_active', true)->get();
                $saldoAwalCash = $financialAccounts->filter(fn($acc) => strtolower($acc->type) === 'cash')->sum('balance');
                $saldoAwalBca = $financialAccounts->filter(fn($acc) => Str::contains(strtolower($acc->type), 'bca'))->sum('balance');
                $saldoAwalMandiri = $financialAccounts->filter(fn($acc) => Str::contains(strtolower($acc->type), 'mandiri'))->sum('balance');
            }

            $mutations = [
                'salesCash' => 0, 'buyCash' => 0,
                'salesBca' => 0, 'buyBca' => 0,
                'salesMandiri' => 0, 'buyMandiri' => 0,
            ];

            foreach ($todaysTransactions as $trx) {
                $nominal = (float) $trx->total_idr;
                $type = $trx->type;
                $accountType = $trx->financialAccount ? strtolower($trx->financialAccount->type) : '';
                
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
                $ftype = $op->financialAccount ? strtolower($op->financialAccount->type) : '';

                if ($ftype === 'cash') {
                    if ($op->type === 'in') $opsSummary['cash_in'] += $amt;
                    else $opsSummary['cash_out'] += $amt;
                } 
                elseif (in_array($ftype, ['bca', 'mandiri'])) {
                    if ($op->type === 'in') {
                        if ($ftype === 'bca') $opsSummary['bca_in'] += $amt;
                        else $opsSummary['mandiri_in'] += $amt;
                        $opsSummary['transfer_to_bank'] += $amt; 
                    } else {
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

            $saldoAkhirKas = $saldoAwalCash + $mutations['salesCash'] - $mutations['buyCash'] + $opsSummary['cash_in'] - $opsSummary['cash_out'] + $opsSummary['transfer_from_bank_to_cash'] - $opsSummary['transfer_to_bank'];
            $saldoAkhirBca = $saldoAwalBca + $mutations['salesBca'] - $mutations['buyBca'] + $opsSummary['bca_in'] - $opsSummary['bca_out'];
            $saldoAkhirMandiri = $saldoAwalMandiri + $mutations['salesMandiri'] - $mutations['buyMandiri'] + $opsSummary['mandiri_in'] - $opsSummary['mandiri_out'];
            $totalSaldoAkhir = $saldoAkhirKas + $saldoAkhirBca + $saldoAkhirMandiri + $opsSummary['ghost_adjustment'];
            $grandTotalHariIni = $totalSaldoAkhir + $totalAssetValas;

            $yesterdayClosing = DailyClosing::where('report_date', '<', $date)
                ->orderBy('report_date', 'desc')
                ->first();
            $yesterdayGrandTotal = $yesterdayClosing ? $yesterdayClosing->grand_total : 0;

            return Inertia::render('Laporan/Index', [
                'date' => $date,
                'grandTotalHariIni' => $grandTotalHariIni,
                'yesterdayGrandTotal' => $yesterdayGrandTotal,
                'isClosed' => false,
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
                        'total_money' => $totalSaldoAkhir,
                        'asset_valas' => $totalAssetValas,
                    ],
                    'transactions' => $paginatedTransactions, 
                    'ops' => $opsSummary,
                    'saldo_akhir' => [
                        'cash' => $saldoAkhirKas,
                        'bca' => $saldoAkhirBca,
                        'mandiri' => $saldoAkhirMandiri,
                    ],
                ]
            ]);
        }
    }
    public function destroy($id)
    {
        $today = now()->toDateString();
        
        if (Str::startsWith($id, 'ops-')) {
            $realId = Str::replace('ops-', '', $id);
            $op = \App\Models\OperationalEntry::findOrFail($realId);
            
            if ($op->created_at->format('Y-m-d') !== $today) {
                return back()->withErrors(['message' => 'Hanya data hari ini yang bisa dihapus!']);
            }
            
            if (DailyClosing::where('report_date', $today)->exists()) {
                 return back()->withErrors(['message' => 'Shift hari ini sudah ditutup, tidak bisa menghapus data!']);
            }

            $op->delete();
            return back()->with('success', 'Data operasional berhasil dihapus.');
        } else {
            $trx = Transactions::findOrFail($id);
            
            if ($trx->created_at->format('Y-m-d') !== $today) {
                return back()->withErrors(['message' => 'Hanya transaksi hari ini yang bisa dihapus!']);
            }
            
            if (DailyClosing::where('report_date', $today)->exists()) {
                 return back()->withErrors(['message' => 'Shift hari ini sudah ditutup, tidak bisa menghapus data!']);
            }

            $currency = \App\Models\Currencies::find($trx->currency_id);
            if ($currency) {
                if ($trx->type === 'buy') {
                    $currentTotalVal = $currency->stock_amount * $currency->average_rate;
                    $buyVal = $trx->amount * $trx->rate;
                    $prevTotalVal = $currentTotalVal - $buyVal;
                    $prevStock = $currency->stock_amount - $trx->amount;
                    
                    if ($prevStock > 0) {
                        $currency->average_rate = abs($prevTotalVal) < 0.01 ? 0 : $prevTotalVal / $prevStock;
                    } else {
                        $currency->average_rate = 0;
                    }
                    $currency->stock_amount = $prevStock;
                    
                } elseif ($trx->type === 'sell') {
                    $currency->stock_amount += $trx->amount;
                }
                $currency->save();
            }

            $trx->delete();
            return back()->with('success', 'Transaksi berhasil dihapus.');
        }
    }
}
