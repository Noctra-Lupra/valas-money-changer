<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CurrenciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currencies = [
            ['code' => 'usd', 'name' => 'Dollar Amerika Serikat', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'usdc', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'usdc2', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'usdc3', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'usdk', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'sgd', 'name' => 'Dollar Singapura', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'sgd2', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'sgdk', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'eur', 'name' => 'Euro', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'myr', 'name' => 'Ringgit Malaysia', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'myrk', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'myr1', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'sar', 'name' => 'Saudi Riyal', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'sark', 'name' => '', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'thb', 'name' => 'Thai Baht', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'php', 'name' => 'Philippine Peso', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'iqd', 'name' => 'Iraqi Dinar', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'rub', 'name' => 'Russian Ruble', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'ran', 'name' => 'South African Rand', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0], // Asumsi RAN = ZAR
            ['code' => 'qtr', 'name' => 'Qatari Rial', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],      // Asumsi QTR = QAR
            ['code' => 'cad', 'name' => 'Canadian Dollar', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'try', 'name' => 'Turkish Lira', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'krw', 'name' => 'South Korean Won', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'aed', 'name' => 'UAE Dirham', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
            ['code' => 'cny', 'name' => 'Chinese Yuan', 'variant' => '', 'stock_amount' => 0, 'average_rate' => 0],
        ];

        foreach ($currencies as $cur) {
            DB::table('currencies')->updateOrInsert(
                ['code' => $cur['code']],
                [
                    'name' => $cur['name'],
                    'variant' => $cur['variant'],
                    'stock_amount' => $cur['stock_amount'],
                    'average_rate' => $cur['average_rate'],
                    'last_update' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}