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

        if ($todayClosing) {
            $openingBalances = [
                'cash' => $todayClosing->cash_ending_balance,
                'bca' => $todayClosing->bca_ending_balance,
                'mandiri' => $todayClosing->mandiri_ending_balance,
            ];
        } else {
             $yesterdayClosing = \App\Models\DailyClosing::where('report_date', '<', $date)
                ->orderBy('report_date', 'desc')
                ->first();

             if ($yesterdayClosing) {
                $openingBalances = [
                    'cash' => $yesterdayClosing->cash_ending_balance,
                    'bca' => $yesterdayClosing->bca_ending_balance,
                    'mandiri' => $yesterdayClosing->mandiri_ending_balance,
                ];
             }
        }

        return Inertia::render('Settings/Index', [
            'users' => User::orderBy('id', 'ASC')->get(),
            'financialAccounts' => FinancialAccount::where('is_active', true)->get(),
            'currencies' => \App\Models\Currencies::all(),
            'openingBalances' => $openingBalances,
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
        ]);

        foreach ($request->accounts as $acc) {
            FinancialAccount::where('type', $acc['type'])->update(['balance' => $acc['balance']]);
        }

        $date = now()->toDateString();
        $yesterdayClosing = \App\Models\DailyClosing::where('report_date', '<', $date)
            ->orderBy('report_date', 'desc')
            ->first();

        if ($yesterdayClosing) {
            $updates = [];
            foreach ($request->accounts as $acc) {
                $type = strtolower($acc['type']);
                if ($type === 'cash') {
                    $updates['cash_ending_balance'] = $acc['balance'];
                } elseif ($type === 'bca') {
                    $updates['bca_ending_balance'] = $acc['balance'];
                } elseif ($type === 'mandiri') {
                    $updates['mandiri_ending_balance'] = $acc['balance'];
                }
            }
            
            if (!empty($updates)) {
                $yesterdayClosing->update($updates);
            }
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
