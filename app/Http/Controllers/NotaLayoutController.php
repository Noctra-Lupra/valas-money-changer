<?php

namespace App\Http\Controllers;

use App\Models\NotaLayout;
use Illuminate\Http\Request;

class NotaLayoutController extends Controller
{
    public function save(Request $request)
    {
        $request->validate([
            'template_id' => 'required|integer|min:1|max:4',
            'layout' => 'required|array',
        ]);

        $userId = auth()->id();

        NotaLayout::updateOrCreate(
            [
                'user_id' => $userId,
                'template_id' => $request->template_id,
            ],
            [
                'layout' => $request->layout,
            ]
        );

        return back()->with('success', 'Layout nota berhasil disimpan.');
    }
}
