<?php

namespace App\Http\Controllers;

use App\Models\InvoiceTemplate;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceTemplateController extends Controller
{
    public function show(Transactions $transaction)
    {
        return Inertia::render('Invoice/Show', [
            'transaction'     => $transaction,
            'items'           => $transaction->items,
            'invoiceTemplate' => InvoiceTemplate::first(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string',
            'address'      => 'required|string',
            'footer_note'  => 'nullable|string',
        ]);

        InvoiceTemplate::updateOrCreate(
            ['id' => 1],
            $data
        );

        return back()->with('success', 'Template nota berhasil disimpan');
    }
}
