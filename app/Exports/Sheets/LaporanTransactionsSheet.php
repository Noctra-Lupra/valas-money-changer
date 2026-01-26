<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Collection;

class LaporanTransactionsSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize
{
    protected $transactions;
    protected $date;

    public function __construct(Collection $transactions, string $date)
    {
        $this->transactions = $transactions;
        $this->date = $date;
    }

    public function collection()
    {
        return $this->transactions;
    }

    public function headings(): array
    {
        return [
            'Waktu',
            'Tipe',
            'No Invoice',
            'Customer / Keterangan',
            'Jenis',
            'Mata Uang',
            'Kurs',
            'Pembayaran',
            'Jml Valas',
            'Total IDR',
            'Admin',
        ];
    }

    public function map($row): array
    {
        $jenis = '';
        if ($row['is_operational']) {
            $jenis = $row['transaction_type'] === 'in' ? 'Pemasukan' : 'Pengeluaran';
        } else {
             $jenis = $row['transaction_type'] === 'buy' ? 'Beli Valas' : 'Jual Valas';
        }

        return [
            $row['time'],
            $row['is_operational'] ? 'OPERATIONAL' : 'TRANSAKSI',
            $row['invoice_number'],
            $row['customer'],
            $jenis,
            $row['currency_code'],
            $row['rate'],
            strtoupper($row['payment_method']),
            $row['amount_valas'] != 0 ? $row['amount_valas'] : '-',
            $row['total_idr'],
            $row['user_name'],
        ];
    }

    public function title(): string
    {
        return 'Mutasi Transaksi';
    }
}
