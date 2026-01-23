<?php

namespace App\Http\Controllers;

use App\Models\Currencies;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokValasController extends Controller
{
    public function index()
    {
        $stocks = Currencies::orderBy('id', 'ASC')->get();
        
        return Inertia::render('StokValas/Index', [
            'stocks' => $stocks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:currencies,code|max:5',
            'name' => 'nullable|string|max:255',
        ]);

        Currencies::create([
            'code' => strtoupper($request->code),
            'name' => $request->name ? : "-",
            'variant' => '-',
            'stock_amount' => 0,
            'average_rate' => 0,
            'last_update' => now(),
        ]);

        return redirect()->back()->with('success', 'Valas baru berhasil ditambahkan.');
    }
}
