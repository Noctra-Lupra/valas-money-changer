<table>
    <thead>
        <tr>
            <th colspan="6" style="font-size: 16px; font-weight: bold; text-align: center; background-color: #B4C6E7;">Berthaut Money Changer</th>
        </tr>
        <tr>
            <th colspan="6" style="font-size: 14px; font-weight: bold; text-align: center; background-color: #B4C6E7;">{{ $date }}</th>
        </tr>
        <tr></tr>
    </thead>
    <tbody>
        @php
            // Format Ribuan Indonesia
            $fmt = function($val) {
                return number_format((float)$val, 0, ',', '.');
            };

            // Format Desimal
            $fmtDec = function($val) {
                return number_format((float)$val, 2, ',', '.');
            };
        @endphp

        {{-- Saldo Awal --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Saldo Awal</th>
        </tr>
        <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000;">Cash</td>
            {{-- Tambahkan &nbsp; agar Excel tidak mengubah titik jadi koma --}}
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000; text-align: right;">{{ $fmt($saldo_awal['cash'] ?? 0) }}&nbsp;</td>
        </tr>
        <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #4472C4; color: white;">BCA</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #4472C4; color: white; text-align: right;">{{ $fmt($saldo_awal['bca'] ?? 0) }}&nbsp;</td>
        </tr>
        <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000;">Mandiri</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000; text-align: right;">{{ $fmt($saldo_awal['mandiri'] ?? 0) }}&nbsp;</td>
        </tr>
        <tr></tr>

        {{-- Pembelian --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Pembelian (Buy)</th>
        </tr>
        <tr>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Currency</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Amount</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Rate</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Result</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Payment by</th>
        </tr>
        @foreach($buys as $buy)
            <tr>
                <td style="border: 1px solid #000000; text-align: center;">{{ $buy->currency->code }}</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($buy->amount) }}&nbsp;</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($buy->rate) }}&nbsp;</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($buy->total_idr) }}&nbsp;</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: center; background-color: {{ strtolower($buy->financialAccount->type) == 'bca' ? '#4472C4' : (strtolower($buy->financialAccount->type) == 'mandiri' ? '#FFC000' : '#FFFFFF') }}; color: {{ strtolower($buy->financialAccount->type) == 'bca' ? '#FFFFFF' : '#000000' }};">{{ ucfirst($buy->financialAccount->type) }}</td>
            </tr>
        @endforeach
        <tr>
            <td colspan="3" style="font-weight: bold; text-align: right; border: 1px solid #000000;">Total Pembelian</td>
            <td style="font-weight: bold; border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($buys->sum('total_idr')) }}&nbsp;</td>
            <td colspan="2" style="border: 1px solid #000000;"></td>
        </tr>
        <tr></tr>

        {{-- Penjualan --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Penjualan (Sell)</th>
        </tr>
        <tr>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Currency</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Amount</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Rate</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Result</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Payment by</th>
        </tr>
        @foreach($sells as $sell)
             <tr>
                <td style="border: 1px solid #000000; text-align: center;">{{ $sell->currency->code }}</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($sell->amount) }}&nbsp;</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($sell->rate) }}&nbsp;</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($sell->total_idr) }}&nbsp;</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: center; background-color: {{ strtolower($sell->financialAccount->type) == 'bca' ? '#4472C4' : (strtolower($sell->financialAccount->type) == 'mandiri' ? '#FFC000' : '#FFFFFF') }}; color: {{ strtolower($sell->financialAccount->type) == 'bca' ? '#FFFFFF' : '#000000' }};">{{ ucfirst($sell->financialAccount->type) }}</td>
            </tr>
        @endforeach
        <tr>
            <td colspan="3" style="font-weight: bold; text-align: right; border: 1px solid #000000;">Total Penjualan</td>
            <td style="font-weight: bold; border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($sells->sum('total_idr')) }}&nbsp;</td>
            <td colspan="2" style="border: 1px solid #000000;"></td>
        </tr>
        <tr></tr>

        {{-- Pemasukan --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Pemasukan (Income)</th>
        </tr>
        <tr>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Description</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Amount</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Payment by</th>
        </tr>
        @if(count($ops_in) > 0)
            @foreach($ops_in as $op)
                <tr>
                    <td colspan="2" style="border: 1px solid #000000;">{{ $op->description }}</td>
                    <td colspan="2" style="border: 1px solid #000000; text-align: right;">{{ $fmt($op->amount) }}&nbsp;</td>
                    <td colspan="2" style="border: 1px solid #000000; text-align: center;">{{ ucfirst($op->financialAccount->type) }}</td>
                </tr>
            @endforeach
        @else
            <tr>
                <td colspan="2" style="border: 1px solid #000000; text-align: center;">-</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: center;">-</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: center;">-</td>
            </tr>
        @endif
        <tr></tr>

        {{-- Pengeluaran --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Pengeluaran (Outcome)</th>
        </tr>
        <tr>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Description</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Amount</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Payment by</th>
        </tr>
        @if(count($ops_out) > 0)
            @foreach($ops_out as $op)
                <tr>
                    <td colspan="2" style="border: 1px solid #000000;">{{ $op->description }}</td>
                    <td colspan="2" style="border: 1px solid #000000; text-align: right;">{{ $fmt($op->amount) }}&nbsp;</td>
                    <td colspan="2" style="border: 1px solid #000000; text-align: center;">{{ ucfirst($op->financialAccount->type) }}</td>
                </tr>
            @endforeach
        @else
            <tr>
                <td colspan="2" style="border: 1px solid #000000; text-align: center;">-</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: center;">-</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: center;">-</td>
            </tr>
        @endif
        <tr></tr>
        
        {{-- Grand Total --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Grand Total</th>
        </tr>
        <tr>
            <th colspan="3" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Description</th>
            <th colspan="3" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Amount</th>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD;">Total Pembelian Valas</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($buys->sum('total_idr')) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD;">Total Penjualan Valas</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($sells->sum('total_idr')) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000;">Total Akhir Money</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000; text-align: right;">{{ $fmt($grand_total_money) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000;">Total Aset Valas</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000; text-align: right;">{{ $fmt($total_asset_valas) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000;">Grand Total (Sub Total)</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFC000; text-align: right;">{{ $fmt($grand_total) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFFF00; font-weight: bold;">PROFIT</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #FFFF00; font-weight: bold; text-align: right;">{{ $fmt($net_profit) }}&nbsp;</td>
        </tr>
        <tr></tr>

         {{-- Saldo Akhir --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Saldo Akhir</th>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD;">Cash</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($saldo_akhir['cash']) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD;">BCA</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($saldo_akhir['bca']) }}&nbsp;</td>
        </tr>
         <tr>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD;">Mandiri</td>
            <td colspan="3" style="border: 1px solid #000000; background-color: #F8CBAD; text-align: right;">{{ $fmt($saldo_akhir['mandiri']) }}&nbsp;</td>
        </tr>
         <tr></tr>

         {{-- Stok Valas --}}
        <tr>
            <th colspan="6" style="font-weight: bold; text-align: center; background-color: #B4C6E7; border: 1px solid #000000;">Stok Valas</th>
        </tr>
        <tr>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Currency</th>
            <th style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Stock</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Average</th>
            <th colspan="2" style="font-weight: bold; text-align: center; background-color: #E7E6E6; border: 1px solid #000000;">Result</th>
        </tr>
        @foreach($currencies as $currency)
             <tr>
                <td style="border: 1px solid #000000; text-align: center;">{{ $currency->code }}</td>
                <td style="border: 1px solid #000000; text-align: right;">{{ $fmt($currency->stock_amount) }}&nbsp;</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: right;">{{ $fmtDec($currency->average_rate) }}&nbsp;</td>
                <td colspan="2" style="border: 1px solid #000000; text-align: right;">{{ $fmt($currency->stock_amount * $currency->average_rate) }}&nbsp;</td>
            </tr>
        @endforeach
        
    </tbody>
</table>