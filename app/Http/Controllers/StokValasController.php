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
}
