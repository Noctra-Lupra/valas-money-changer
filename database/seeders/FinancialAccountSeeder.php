<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FinancialAccountSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'account_name' => 'CASH',
                'account_number' => null, 
                'type' => 'cash', 
                'balance' => 100000000, 
            ],
            [
                'account_name' => 'BCA(1)',
                'account_number' => '1234567890',
                'type' => 'bca',
                'balance' => 400000000,
            ],
            [
                'account_name' => 'BCA(2)',
                'account_number' => '0987654321',
                'type' => 'bca2',
                'balance' => 100000000,
            ],
            [
                'account_name' => 'MANDIRI(1)',
                'account_number' => '111000222333',
                'type' => 'mandiri',
                'balance' => 80000000,
            ],
            [
                'account_name' => 'MANDIRI(2)',
                'account_number' => '444555666777',
                'type' => 'mandiri2', 
                'balance' => 20000000,
            ],
        ];

        foreach ($accounts as $acc) {
            DB::table('financial_accounts')->insert([
                'account_name' => $acc['account_name'],
                'account_number' => $acc['account_number'],
                'type' => $acc['type'],
                'balance' => $acc['balance'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}