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
        Schema::create('nota_layouts', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->nullable(); 
            // kalau sistem kamu pakai company_id, ganti jadi company_id

            $table->unsignedTinyInteger('template_id'); // 1-4
            $table->json('layout'); // simpan items editor

            $table->timestamps();

            $table->unique(['user_id', 'template_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nota_layouts');
    }
};
