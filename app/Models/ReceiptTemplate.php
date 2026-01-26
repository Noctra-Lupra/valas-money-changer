<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceiptTemplate extends Model
{
    protected $fillable = [
        'name',
        'image_path',
        'elements',
        'is_active'
    ];

    protected $casts = [
        'elements' => 'array'
    ];
}
