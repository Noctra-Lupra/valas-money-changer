<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page.
     */
    public function index(): Response
    {
        $financialAccounts = FinancialAccount::where('is_active', true)->get();

        return Inertia::render('Dashboard', [
            'financialAccounts' => $financialAccounts,
        ]);
    }
}
