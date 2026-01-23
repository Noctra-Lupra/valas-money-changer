<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyClosing extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'report_date' => 'date',
        'cash_opening_balance' => 'decimal:2',
        'cash_sales' => 'decimal:2',
        'cash_buy' => 'decimal:2',
        'cash_ending_balance' => 'decimal:2',
        'bca_opening_balance' => 'decimal:2',
        'bca_mutation_in' => 'decimal:2',
        'bca_mutation_out' => 'decimal:2',
        'bca_ending_balance' => 'decimal:2',
        'mandiri_opening_balance' => 'decimal:2',
        'mandiri_mutation_in' => 'decimal:2',
        'mandiri_mutation_out' => 'decimal:2',
        'mandiri_ending_balance' => 'decimal:2',
        'total_buy_transaction' => 'decimal:2',
        'total_sales_transaction' => 'decimal:2',
        'total_money_balance' => 'decimal:2',
        'total_valas_balance' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'net_profit' => 'decimal:2',
    ];
}
