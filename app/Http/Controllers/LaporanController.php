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

        return Inertia::render('Laporan/Index', [
            'financialAccounts' => $financialAccounts,
        ]);
    }
}
