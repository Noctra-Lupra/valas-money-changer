<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotaLayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'template_id',
        'layout',
    ];

    protected $casts = [
        'layout' => 'array',
    ];
}
