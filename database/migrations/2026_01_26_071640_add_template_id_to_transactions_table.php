<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('transactions', 'template_id')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->unsignedBigInteger('template_id')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('transactions', 'template_id')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropColumn('template_id');
            });
        }
    }
};

