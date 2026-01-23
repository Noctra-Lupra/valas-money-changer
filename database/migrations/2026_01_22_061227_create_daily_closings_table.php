<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_closings', function (Blueprint $table) {
            $table->id();
            $table->date('report_date')->unique();
            $table->decimal('cash_opening_balance', 15, 2)->default(0); 
            $table->decimal('cash_sales', 15, 2)->default(0); 
            $table->decimal('cash_buy', 15, 2)->default(0); 
            $table->decimal('cash_ending_balance', 15, 2);
            $table->decimal('bca_opening_balance', 15, 2)->default(0);
            $table->decimal('bca_mutation_in', 15, 2)->default(0);      
            $table->decimal('bca_mutation_out', 15, 2)->default(0);
            $table->decimal('bca_ending_balance', 15, 2);
            $table->decimal('mandiri_opening_balance', 15, 2)->default(0);
            $table->decimal('mandiri_mutation_in', 15, 2)->default(0);
            $table->decimal('mandiri_mutation_out', 15, 2)->default(0);
            $table->decimal('mandiri_ending_balance', 15, 2);
            $table->decimal('total_buy_transaction', 15, 2)->default(0); 
            $table->decimal('total_sales_transaction', 15, 2)->default(0);
            $table->decimal('total_money_balance', 15, 2); 
            $table->decimal('total_valas_balance', 15, 2);
            $table->decimal('grand_total', 15, 2);
            $table->decimal('net_profit', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_closings');
    }
};
