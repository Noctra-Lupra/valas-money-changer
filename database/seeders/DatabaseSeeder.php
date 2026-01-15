<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. USERS
        // Kita buat 1 Admin dan 1 Staff
        $adminId = DB::table('users')->insertGetId([
            'name' => 'Owner Ganteng',
            'username' => 'admin',
            'password' => Hash::make('password'), // password default
            'role' => 'admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $staffId = DB::table('users')->insertGetId([
            'name' => 'Kasir Cantik',
            'username' => 'staff',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. FINANCIAL ACCOUNTS (Kas & Bank)
        $kasId = DB::table('financial_accounts')->insertGetId([
            'account_name' => 'Kas Fisik (Laci)',
            'account_number' => null,
            'balance' => 150000000, // 150 Juta
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $bcaId = DB::table('financial_accounts')->insertGetId([
            'account_name' => 'BCA Utama',
            'account_number' => '8830123456',
            'balance' => 500000000, // 500 Juta
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('financial_accounts')->insert([
            'account_name' => 'Mandiri Operasional',
            'account_number' => '1230009876543',
            'balance' => 25000000, // 25 Juta
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. CURRENCIES (Stok Valas)
        // Kita isi beberapa varian mata uang
        $usdBagusId = DB::table('currencies')->insertGetId([
            'code' => 'USD',
            'name' => 'Dollar Amerika',
            'variant' => 'Fisik Bagus',
            'stock_amount' => 1000, // Ada 1000 lembar
            'average_rate' => 15000, // Modal rata-rata Rp 15.000
            'last_update' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $usdRusakId = DB::table('currencies')->insertGetId([
            'code' => 'USD',
            'name' => 'Dollar Amerika',
            'variant' => 'Lecet/Cap',
            'stock_amount' => 200,
            'average_rate' => 14500, // Modal lebih murah
            'last_update' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $sgdBagusId = DB::table('currencies')->insertGetId([
            'code' => 'SGD',
            'name' => 'Dollar Singapura',
            'variant' => 'Fisik Bagus',
            'stock_amount' => 5000,
            'average_rate' => 11500,
            'last_update' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. TRANSACTIONS (Riwayat Transaksi)
        // Contoh 1: Nasabah JUAL Dollar ke Kita (Kita Beli -> Stok Nambah)
        DB::table('transactions')->insert([
            'id' => Str::uuid(),
            'invoice_number' => 'TRX-' . date('Ymd') . '-001',
            'user_id' => $staffId,
            'currency_id' => $usdBagusId,
            'financial_account_id' => $kasId, // Bayar pakai Kas
            'type' => 'buy',
            'customer_name' => 'Budi Santoso',
            'rate' => 15200, // Kita beli di harga 15.200
            'amount' => 100, // 100 Lembar
            'total_idr' => 1520000, // 1.520.000
            'cost_of_good_sold' => 0, // Kalau buy COGS 0 atau sama dengan rate
            'profit' => 0, // Belum ada profit saat beli
            'notes' => 'Pecahan 100 dollar baru',
            'created_at' => Carbon::parse('09:00:00'),
            'updated_at' => Carbon::parse('09:00:00'),
        ]);

        // Contoh 2: Nasabah BELI SGD dari Kita (Kita Jual -> Stok Berkurang -> Ada Profit)
        DB::table('transactions')->insert([
            'id' => Str::uuid(),
            'invoice_number' => 'TRX-' . date('Ymd') . '-002',
            'user_id' => $staffId,
            'currency_id' => $sgdBagusId,
            'financial_account_id' => $bcaId, // Nasabah transfer ke BCA
            'type' => 'sell',
            'customer_name' => 'PT Maju Mundur',
            'rate' => 12000, // Jual di 12.000
            'amount' => 1000, // 1000 Lembar
            'total_idr' => 12000000, // 12 Juta
            'cost_of_good_sold' => 11500, // Modal (Average Rate tadi)
            'profit' => (12000 - 11500) * 1000, // (Jual - Modal) * Jumlah = 500.000 Profit
            'notes' => 'Untuk perjalanan dinas',
            'created_at' => Carbon::parse('10:30:00'),
            'updated_at' => Carbon::parse('10:30:00'),
        ]);

        // 5. OPERATIONAL ENTRIES (Pengeluaran Lain)
        DB::table('operational_entries')->insert([
            [
                'user_id' => $adminId,
                'financial_account_id' => $bcaId,
                'type' => 'in',
                'category' => 'Modal Awal',
                'amount' => 100000000,
                'description' => 'Setor modal tambahan',
                'created_at' => now()->subDays(1),
            ],
            [
                'user_id' => $adminId,
                'financial_account_id' => $kasId,
                'type' => 'out',
                'category' => 'Listrik & WiFi',
                'amount' => 1500000,
                'description' => 'Bayar Indihome bulan ini',
                'created_at' => now(),
            ],
        ]);

        // 6. APP SETTINGS
        DB::table('app_settings')->insert([
            ['key' => 'company_name', 'value' => 'PT. VALAS SEJAHTERA ABADI'],
            ['key' => 'company_address', 'value' => 'Jl. Jendral Sudirman No. 88, Jakarta Pusat'],
            ['key' => 'invoice_footer', 'value' => 'Terima kasih. Harap hitung kembali uang Anda sebelum meninggalkan kasir.'],
            ['key' => 'phone_number', 'value' => '021-555-9999'],
        ]);

        // 7. AUDIT LOGS (Contoh Log)
        DB::table('audit_logs')->insert([
            'user_id' => $adminId,
            'action' => 'MANUAL_ADJUSTMENT',
            'target_table' => 'currencies',
            'target_id' => $usdBagusId,
            'old_values' => json_encode(['stock_amount' => 998]),
            'new_values' => json_encode(['stock_amount' => 1000]),
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subHours(2),
        ]);

        // 8. SHIFTS (Shift Kasir)
        // Shift Kemarin (Sudah Tutup)
        DB::table('shifts')->insert([
            'user_id' => $staffId,
            'start_cash_balance' => 10000000,
            'expected_end_balance' => 12000000,
            'actual_end_balance' => 12000000, // Balance (Aman)
            'difference' => 0,
            'started_at' => now()->subDay()->setHour(8),
            'ended_at' => now()->subDay()->setHour(17),
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ]);

        // Shift Hari Ini (Masih Buka)
        DB::table('shifts')->insert([
            'user_id' => $staffId,
            'start_cash_balance' => 12000000,
            'expected_end_balance' => null, // Belum tutup
            'actual_end_balance' => null,
            'difference' => null,
            'started_at' => now()->setHour(8),
            'ended_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}