<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $date = now()->toDateString();
        $todayClosing = \App\Models\DailyClosing::where('report_date', $date)->first();
        
        $openingBalances = null;
        $yesterdayTotalMoneyBalance = 0;
        $yesterdayGrandTotal = 0;

        $yesterdayClosing = \App\Models\DailyClosing::where('report_date', '<', $date)
            ->orderBy('report_date', 'desc')
            ->first();

        if ($todayClosing) {
            $openingBalances = [
                'cash' => $todayClosing->cash_ending_balance,
                'bca' => $todayClosing->bca_ending_balance,
                'mandiri' => $todayClosing->mandiri_ending_balance,
            ];
            $yesterdayGrandTotal = $yesterdayClosing ? $yesterdayClosing->grand_total : 0;
            $yesterdayTotalMoneyBalance = $yesterdayClosing ? $yesterdayClosing->total_money_balance : 0;

        } else {
             if ($yesterdayClosing) {
                $openingBalances = [
                    'cash' => $yesterdayClosing->cash_ending_balance,
                    'bca' => $yesterdayClosing->bca_ending_balance,
                    'mandiri' => $yesterdayClosing->mandiri_ending_balance,
                ];
                $yesterdayGrandTotal = $yesterdayClosing->grand_total;
                $yesterdayTotalMoneyBalance = $yesterdayClosing->total_money_balance;
             }
        }

        return Inertia::render('Settings/Index', [
            'users' => User::orderBy('id', 'ASC')->get(),
            'financialAccounts' => FinancialAccount::where('is_active', true)->get(),
            'currencies' => \App\Models\Currencies::all(),
            'openingBalances' => $openingBalances,
            'yesterdayGrandTotal' => (float) $yesterdayGrandTotal,
            'yesterdayTotalMoneyBalance' => (float) $yesterdayTotalMoneyBalance,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:'.User::class,
            'role' => 'required|string|in:admin,staff',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'is_active' => true,
        ]);

        return redirect()->back();
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak dapat menghapus akun sendiri via menu ini.']);
        }

        $user->delete();

        return redirect()->back();
    }

    /**
     * Update financial accounts.
     */
    public function updateFinancial(Request $request): RedirectResponse
    {
        $request->validate([
            'accounts' => 'required|array',
            'accounts.*.type' => 'required|string|exists:financial_accounts,type',
            'accounts.*.balance' => 'required|numeric',
            'grand_total' => 'nullable|numeric',
            'total_money_balance' => 'nullable|numeric',
        ]);

        foreach ($request->accounts as $acc) {
            FinancialAccount::where('type', $acc['type'])->update(['balance' => $acc['balance']]);
        }

        $date = now()->toDateString();
        $yesterdayDate = \Carbon\Carbon::parse($date)->subDay()->toDateString();
        
        $yesterdayClosing = \App\Models\DailyClosing::where('report_date', '<', $date)
            ->orderBy('report_date', 'desc')
            ->first();

        // If no closing exists, we create one for "yesterday" (or technically today-1) to hold initial values.
        if (!$yesterdayClosing) {
             $yesterdayClosing = \App\Models\DailyClosing::create([
                'report_date' => $yesterdayDate,
                'cash_opening_balance' => 0,
                'cash_sales' => 0,
                'cash_buy' => 0,
                'cash_ending_balance' => 0,
                'bca_opening_balance' => 0,
                'bca_mutation_in' => 0,
                'bca_mutation_out' => 0,
                'bca_ending_balance' => 0,
                'mandiri_opening_balance' => 0,
                'mandiri_mutation_in' => 0,
                'mandiri_mutation_out' => 0,
                'mandiri_ending_balance' => 0,
                'total_buy_transaction' => 0,
                'total_sales_transaction' => 0,
                'total_money_balance' => 0,
                'total_valas_balance' => 0,
                'grand_total' => 0,
                'net_profit' => 0,
            ]);
        }

        if ($yesterdayClosing) {
            $updates = [];
            $totalMoneyBalance = 0;
            
            $newBalances = [];
            foreach ($request->accounts as $acc) {
                $newBalances[$acc['type']] = $acc['balance'];
            }
            
            $allAccounts = FinancialAccount::where('is_active', true)->get();
            
            $cashBalance = 0;
            $bcaBalance = 0;
            $mandiriBalance = 0;
            
            foreach ($allAccounts as $account) {
                $type = $account->type;
                $balance = $newBalances[$type] ?? $account->balance;
                
                $lowerType = strtolower($type);
                if ($lowerType === 'cash') {
                    $cashBalance += $balance;
                } elseif (str_contains($lowerType, 'bca')) {
                    $bcaBalance += $balance;
                } elseif (str_contains($lowerType, 'mandiri')) {
                    $mandiriBalance += $balance;
                }
            }
            
            $updates['cash_ending_balance'] = $cashBalance;
            $updates['bca_ending_balance'] = $bcaBalance;
            $updates['mandiri_ending_balance'] = $mandiriBalance;
            
            // Total Money Balance Logic
            if ($request->filled('total_money_balance')) {
                // Manual override: Just save it. User requested NO changes to individual balances.
                $totalMoneyBalance = $request->total_money_balance;
            } else {
                // Computed
                $totalMoneyBalance = $cashBalance + $bcaBalance + $mandiriBalance;
            }
            $updates['total_money_balance'] = $totalMoneyBalance;
            
            // Grand Total Logic
            if ($request->filled('grand_total')) {
                // Manual override
                $updates['grand_total'] = $request->grand_total;
            } else {
                // Computed
                $updates['grand_total'] = $totalMoneyBalance + $yesterdayClosing->total_valas_balance;
            }
            
            // Recalculate Net Profit
            $dayBefore = \App\Models\DailyClosing::where('report_date', '<', $yesterdayClosing->report_date)
                ->orderBy('report_date', 'desc')
                ->first();
            $dayBeforeGT = $dayBefore ? $dayBefore->grand_total : 0;
            
            $updates['net_profit'] = $updates['grand_total'] - $dayBeforeGT;

            $yesterdayClosing->update($updates);
        }

        return redirect()->back();
    }

    /**
     * Update currency stock and rate.
     */
    public function updateStock(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|exists:currencies,code',
            'stock_amount' => 'required|integer|min:0',
            'average_rate' => 'required|numeric|min:0',
        ]);

        \App\Models\Currencies::where('code', $request->code)->update([
            'stock_amount' => $request->stock_amount,
            'average_rate' => $request->average_rate,
            'last_update' => now(),
        ]);

        return redirect()->back()->with('success', 'Stok valas berhasil dikoreksi.');
    }
}
