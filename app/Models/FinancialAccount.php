<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_name',
        'account_number',
        'balance',
        'type',
        'is_active',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
