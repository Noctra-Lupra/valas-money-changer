<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Transactions extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'invoice_number',
        'template_id',
        'user_id',
        'currency_id',
        'financial_account_id',
        'type',
        'customer_name',
        'rate',
        'amount',
        'total_idr',
        'cost_of_good_sold',
        'profit',
        'notes',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currencies::class);
    }

    public function financialAccount()
    {
        return $this->belongsTo(FinancialAccount::class);
    }
}
