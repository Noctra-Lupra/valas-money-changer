<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\Sheets\LaporanDailySheet;
use App\Exports\Sheets\LaporanTransactionsSheet;
use Illuminate\Support\Collection;

class LaporanExport implements WithMultipleSheets
{
    use Exportable;

    protected $data;
    protected $date;

    public function __construct(array $data, string $date)
    {
        $this->data = $data;
        $this->date = $date;
    }

    public function sheets(): array
    {
        $sheets = [
            new LaporanDailySheet($this->data, $this->date),
        ];
        
        if (isset($this->data['transactions_all'])) {
             $sheets[] = new LaporanTransactionsSheet($this->data['transactions_all'], $this->date);
        }

        return $sheets;
    }
}
