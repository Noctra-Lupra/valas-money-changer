<?php

namespace App\Http\Controllers;

use App\Models\ReceiptTemplate;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ReceiptTemplateController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'image' => 'required|image',
            'elements' => 'required|string',
        ]);

        ReceiptTemplate::query()->update(['is_active' => false]);

        try {
            $uploaded = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'receipt-templates',
                    'resource_type' => 'image',
                ]
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Upload gambar gagal'
            ], 500);
        }

        $template = ReceiptTemplate::create([
            'name' => $request->name,
            'image_url' => $uploaded->getSecurePath(),
            'elements' => json_decode($request->elements, true),
            'is_active' => true,
        ]);

        return response()->json($template);
    }

    public function active()
    {
        return ReceiptTemplate::latest()->first();
    }
}
