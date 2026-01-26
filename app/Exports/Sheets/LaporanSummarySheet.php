<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LaporanSummarySheet implements FromArray, WithTitle, ShouldAutoSize, WithHeadings
{
    protected $data;
    protected $date;

    public function __construct(array $data, string $date)
    {
        $this->data = $data;
        $this->date = $date;
    }

    public function headings(): array
    {
        return [
            ['LAPORAN HARIAN', $this->date],
            [''],
            ['KETERANGAN', 'RINCIAN', 'JUMLAH (IDR)'],
        ];
    }

    public function array(): array
    {
        $d = $this->data;
        $sAwal = $d['saldo_awal'];
        $mut = $d['mutations'];
        $ops = $d['ops'];
        $sAkhir = $d['saldo_akhir'];
        $totals = $d['totals'];

        $bcaMasuk = ($mut['salesBca'] ?? 0) + ($ops['bca_in'] ?? 0);
        $bcaKeluar = ($mut['buyBca'] ?? 0) + ($ops['bca_out'] ?? 0);
        
        $mandiriMasuk = ($mut['salesMandiri'] ?? 0) + ($ops['mandiri_in'] ?? 0);
        $mandiriKeluar = ($mut['buyMandiri'] ?? 0) + ($ops['mandiri_out'] ?? 0);

        return [
            ['KAS TUNAI'],
            ['Saldo Awal Cash', '', $sAwal['cash']],
            ['Penjualan (Masuk)', '', $mut['salesCash']],
            ['Pembelian (Keluar)', '', $mut['buyCash']],
            ['Operasional Masuk', '', $ops['cash_in']],
            ['Operasional Keluar', '', $ops['cash_out']],
            ['Saldo Akhir Cash', '', $sAkhir['cash']],
            [''],

            ['BANK BCA'],
            ['Saldo Awal BCA', '', $sAwal['bca']],
            ['Mutasi Masuk', '', $bcaMasuk],
            ['Mutasi Keluar', '', $bcaKeluar],
            ['Saldo Akhir BCA', '', $sAkhir['bca']],
            [''],

            ['BANK MANDIRI'],
            ['Saldo Awal Mandiri', '', $sAwal['mandiri']],
            ['Mutasi Masuk', '', $mandiriMasuk],
            ['Mutasi Keluar', '', $mandiriKeluar],
            ['Saldo Akhir Mandiri', '', $sAkhir['mandiri']],
            [''],

            ['REKAPITULASI ASET'],
            ['Total Saldo Akhir (Money)', '', $totals['total_money']],
            ['Total Aset Valas', '', $totals['asset_valas']],
            ['Grand Total Harta', '', $d['grand_total']],
            ['Profit Bersih Hari Ini', '', $d['net_profit']],
        ];
    }

    public function title(): string
    {
        return 'Ringkasan';
    }
}
