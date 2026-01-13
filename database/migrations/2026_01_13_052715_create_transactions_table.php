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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('currency_id')->constrained();
            $table->foreignId('financial_account_id')->constrained();
            $table->enum('type', ['buy', 'sell']);
            $table->string('customer_name');
            $table->decimal('rate', 15, 2);
            $table->integer('amount');
            $table->decimal('total_idr', 15, 2);
            $table->decimal('cost_of_good_sold', 15, 2)->default(0);
            $table->decimal('profit', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
