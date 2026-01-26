<?php

namespace App\Exports\Sheets;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class LaporanDailySheet implements FromView, WithTitle, ShouldAutoSize, WithEvents
{
    protected $data;
    protected $date;

    public function __construct(array $data, string $date)
    {
        $this->data = $data;
        $this->date = $date;
    }

    public function view(): View
    {
        return view('exports.laporan_harian', [
            'date' => \Carbon\Carbon::parse($this->date)->translatedFormat('l, d F Y'),
            'buys' => $this->data['buys'],
            'sells' => $this->data['sells'],
            'currencies' => $this->data['currencies'],
            'saldo_akhir' => $this->data['saldo_akhir'],
            'saldo_awal' => $this->data['saldo_awal'] ?? [],
            'ops' => $this->data['ops'] ?? [],
            'ops_in' => $this->data['ops_in'] ?? [],
            'ops_out' => $this->data['ops_out'] ?? [],
            'grand_total_money' => $this->data['grand_total_money'],
            'total_asset_valas' => $this->data['total_asset_valas'],
            'grand_total' => $this->data['grand_total'],
            'net_profit' => $this->data['net_profit'],
        ]);
    }

    public function title(): string
    {
        return 'Laporan Harian';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getColumnDimension('A')->setAutoSize(true);
                $event->sheet->getColumnDimension('B')->setAutoSize(true);
            },
        ];
    }
}
