import { PageProps, ReportData } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import {
    CalendarIcon,
    Printer,
    Lock,
    TrendingUp,
    Wallet,
    Landmark,
    Banknote,
} from 'lucide-react';


export default function ReportIndex({ auth, date, reportData }: PageProps<{ date: string, reportData: ReportData }>) {

    const { saldo_awal, mutations, totals, transactions } = reportData;

    const [summary, setSummary] = useState({
        total_pemasukan_tunai: 0,
        total_pengeluaran_tunai: 0,
        total_pemasukan_bca: 0,
        total_pengeluaran_bca: 0,
        total_pemasukan_mandiri: 0,
        total_pengeluaran_mandiri: 0,
        grand_total_kemarin: 0,
    });

    const { data, setData, reset } = useForm({
        type: 'out',
        payment_method: 'cash',
        description: '',
        amount: '',
    });

    const totalSemuaPembelian = totals.buy;
    const totalSemuaPenjualan = totals.sales;

    const saldoAkhirKas = (saldo_awal.cash || 0)
        + (mutations.salesCash || 0)
        - (mutations.buyCash || 0)
        + (summary.total_pemasukan_tunai || 0)
        - (summary.total_pengeluaran_tunai || 0);

    const saldoAkhirBca = (saldo_awal.bca || 0)
        + (mutations.salesBca || 0)
        - (mutations.buyBca || 0)
        + (summary.total_pemasukan_bca || 0)
        - (summary.total_pengeluaran_bca || 0);

    const saldoAkhirMandiri = (saldo_awal.mandiri || 0)
        + (mutations.salesMandiri || 0)
        - (mutations.buyMandiri || 0)
        + (summary.total_pemasukan_mandiri || 0)
        - (summary.total_pengeluaran_mandiri || 0);

    const totalSaldoAkhir = saldoAkhirKas + saldoAkhirBca + saldoAkhirMandiri

    const grandTotalHariIni = saldoAkhirKas
        + saldoAkhirBca
        + saldoAkhirMandiri
        + (totals.asset_valas || 0);

    const profitBersih = grandTotalHariIni - (summary.grand_total_kemarin || 0);

    const handleDateChange = (val: string) => {
        router.get(route('laporan.index'), { date: val }, { preserveState: true, preserveScroll: true });
    };

    const formatIDR = (val: number | string) => {
        const num = Number(val);
        if (isNaN(num)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    const formatNumber = (val: number | string) => {
        const num = Number(String(val).replace(/[^0-9]/g, ''));
        if (isNaN(num)) return '';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatDisplayNumber = (val: number | string) => {
        const num = Number(val);
        if (isNaN(num)) return '0';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const formatWIB = (dateString?: string) => {
        if (!dateString) return '-';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return '-';

        return new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const capitalizeWords = (text?: string) => {
        if (!text) return '-';
        return text
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    };



    const handleApplyOps = (e: React.FormEvent) => {
        e.preventDefault();
        const nominal = Number(String(data.amount).replace(/[^0-9]/g, '')) || 0;

        setSummary(prev => {
            const newState = { ...prev };

            if (data.payment_method === 'cash') {
                if (data.type === 'in') {
                    newState.total_pemasukan_tunai = (newState.total_pemasukan_tunai || 0) + nominal;
                } else {
                    newState.total_pengeluaran_tunai = (newState.total_pengeluaran_tunai || 0) + nominal;
                }
            } else if (data.payment_method === 'bca' || data.payment_method === 'bca2') {
                if (data.type === 'in') {
                    newState.total_pemasukan_bca = (newState.total_pemasukan_bca || 0) + nominal;
                } else {
                    newState.total_pengeluaran_bca = (newState.total_pengeluaran_bca || 0) + nominal;
                }
            } else if (data.payment_method === 'mandiri' || data.payment_method === 'mandiri2') {
                if (data.type === 'in') {
                    newState.total_pemasukan_mandiri = (newState.total_pemasukan_mandiri || 0) + nominal;
                } else {
                    newState.total_pengeluaran_mandiri = (newState.total_pengeluaran_mandiri || 0) + nominal;
                }
            }
            return newState;
        });

        alert(`Transaksi ${data.type === 'in' ? 'Pemasukan' : 'Pengeluaran'} (${data.payment_method.toUpperCase()}) sebesar ${formatIDR(nominal)} berhasil dicatat.`);
        reset();
    };

    const handleEndShift = () => {
        alert("Shift Ditutup!\nProfit Bersih: " + formatIDR(profitBersih) + "\nGrand Total: " + formatIDR(grandTotalHariIni));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Laporan Harian & Audit
                </h2>
            }
        >
            <Head title="Laporan Harian" />

            <div className="flex flex-col gap-6 w-full px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col">
                            <Label className="text-xs text-muted-foreground mb-1">Tanggal Laporan</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    className="pl-9 w-full md:w-48 font-semibold"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none">
                            <Printer className="mr-2 h-4 w-4" /> Cetak
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex-1 md:flex-none">
                                    <Lock className="mr-2 h-4 w-4" /> END SHIFT
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tutup Buku Hari Ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <div className="space-y-1">
                                            <p>Profit Bersih: <b className="text-green-600">{formatIDR(profitBersih)}</b></p>
                                            <p>Grand Total Aset: <b>{formatIDR(grandTotalHariIni)}</b></p>
                                        </div>
                                        <p className="mt-3 text-xs text-muted-foreground bg-gray-100 p-2 rounded">
                                            Data hari ini akan disimpan dan dikunci. Saldo Akhir akan menjadi Saldo Awal besok.
                                        </p>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleEndShift}>Ya, Tutup Shift</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-blue-600 shadow-md h-full">
                        <CardHeader className="pb-2 bg-blue-50/50 dark:bg-blue-900/10">
                            <CardTitle className="text-base font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Grand Total & Profit
                            </CardTitle>
                            <CardDescription>Komponen Kekayaan Hari Ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 text-sm">
                            <div className="space-y-2 border-b border-dashed pb-3">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">Total Pembelian</span>
                                    <span className=" font-bold">{formatIDR(totalSemuaPembelian)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">Total Penjualan</span>
                                    <span className=" font-bold">{formatIDR(totalSemuaPenjualan)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1"><Landmark className="h-3 w-3" /> Total BCA</span>
                                    <span className={`font-bold ${((mutations.salesBca || 0) - (mutations.buyBca || 0) + (summary.total_pemasukan_bca || 0) - (summary.total_pengeluaran_bca || 0)) < 0 ? 'text-red-600' : 'text-white/80'}`}>
                                        {formatIDR((mutations.salesBca || 0) - (mutations.buyBca || 0) + (summary.total_pemasukan_bca || 0) - (summary.total_pengeluaran_bca || 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1"><Landmark className="h-3 w-3" /> Total Mandiri</span>
                                    <span className={`font-bold ${((mutations.salesMandiri || 0) - (mutations.buyMandiri || 0) + (summary.total_pemasukan_mandiri || 0) - (summary.total_pengeluaran_mandiri || 0)) < 0 ? 'text-red-600' : 'text-white/80'}`}>
                                        {formatIDR((mutations.salesMandiri || 0) - (mutations.buyMandiri || 0) + (summary.total_pemasukan_mandiri || 0) - (summary.total_pengeluaran_mandiri || 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="">Total Saldo Akhir</span>
                                    <span className=" font-bold">{formatIDR(totalSaldoAkhir)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">Total Saldo Valas</span>
                                    <span className=" font-bold">{formatIDR(totals.asset_valas)}</span>
                                </div>
                            </div>

                            <div className="pt-1">
                                <div className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-2 rounded mb-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Grand Total</span>
                                    <span className=" font-black">{formatIDR(grandTotalHariIni)}</span>
                                </div>
                                <div className="flex justify-between text-red-600 px-2">
                                    <span>Grand Total Kemarin</span>
                                    <span className=" font-bold">{formatIDR(summary.grand_total_kemarin)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-sm font-bold uppercase text-blue-800 dark:text-blue-300">Profit Bersih</span>
                                <span className="text-xl font-black text-blue-700 dark:text-blue-200">
                                    {formatIDR(profitBersih)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-md h-full">
                        <CardHeader className="pb-2 bg-orange-50/50 dark:bg-orange-900/10">
                            <CardTitle className="text-base font-bold text-orange-700 dark:text-orange-400">
                                Input Operasional
                            </CardTitle>
                            <CardDescription>Makan, Bensin, Listrik, dll</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <form onSubmit={handleApplyOps} className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <Select onValueChange={(val) => setData('type', val)} defaultValue="out">
                                        <SelectTrigger className="col-span-1">
                                            <SelectValue placeholder="Pilih Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="out">Pengeluaran</SelectItem>
                                            <SelectItem value="in">Pemasukan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={(val) => setData('payment_method', val)} defaultValue="cash">
                                        <SelectTrigger className="col-span-2">
                                            <SelectValue placeholder="Pilih Metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">CASH</SelectItem>
                                            <SelectItem value="bca">BCA</SelectItem>
                                            <SelectItem value="bca2">BCA2</SelectItem>
                                            <SelectItem value="mandiri">MANDIRI</SelectItem>
                                            <SelectItem value="mandiri2">MANDIRI2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="Nominal..."
                                        className="col-span-3 "
                                        value={formatNumber(data.amount)}
                                        onChange={(e) => setData('amount', e.target.value.replace(/\./g, ''))}
                                    />
                                </div>
                                <Input
                                    placeholder="Keterangan (Wajib diisi)"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={!data.amount || !data.description}>
                                    Simpan Pengeluaran
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600 shadow-md h-full bg-green-50/30 dark:bg-green-900/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> Laporan Saldo Akhir
                            </CardTitle>
                            <CardDescription>Perhitungan semua saldo akhir.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold">Saldo Awal</p>
                                <div className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Cash</span>
                                        <span className="">{formatIDR(saldo_awal.cash)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>BCA</span>
                                        <span className="">{formatIDR(saldo_awal.bca)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Mandiri</span>
                                        <span className="">{formatIDR(saldo_awal.mandiri)}</span>
                                    </div>
                                </div>
                                <Separator className="mb-4" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Saldo Akhir Cash</p>
                                <div className="text-3xl font-black text-green-700 dark:text-green-400 tracking-tight mb-8">
                                    {formatIDR(saldoAkhirKas)}
                                </div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Saldo Akhir BCA</p>
                                <div className="text-3xl font-black text-green-700 dark:text-green-400 tracking-tight mb-8">
                                    {formatIDR(saldoAkhirBca)}
                                </div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Saldo Akhir Mandiri</p>
                                <div className="text-3xl font-black text-green-700 dark:text-green-400 tracking-tight">
                                    {formatIDR(saldoAkhirMandiri)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Banknote className="h-5 w-5" />
                            Audit Trail & History Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Waktu</TableHead>
                                        <TableHead className="w-[100px]">Tipe</TableHead>
                                        <TableHead>Deskripsi / Nasabah</TableHead>
                                        <TableHead className="text-center w-[100px]">Metode</TableHead>
                                        <TableHead className="text-right">Nominal (IDR)</TableHead>
                                        <TableHead className="text-center w-[120px]">User</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className=" text-xs whitespace-nowrap">
                                                <div className='flex flex-col'>
                                                    <span className='font-bold'>{item.invoice_number}</span>
                                                    <span className='text-gray-500'>{formatWIB(item.formatted_time)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={item.transaction_type === 'buy' ? 'default' : 'secondary'} className={item.transaction_type === 'buy' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-orange-600 hover:bg-orange-700'}>
                                                    {item.transaction_type.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{capitalizeWords(item.customer)}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.currency_code.toUpperCase()} {formatDisplayNumber(item.amount_valas)} (Kurs: {formatDisplayNumber(item.rate)})
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="uppercase text-[10px]">{item.payment_method}</Badge>
                                            </TableCell>
                                            <TableCell className={`text-right  font-bold ${item.transaction_type === 'buy' ? 'text-red-600' : 'text-green-600'}`}>
                                                {item.transaction_type === 'buy' ? '-' : '+'} {formatIDR(item.total_idr)}
                                            </TableCell>
                                            <TableCell className="text-center text-xs">
                                                {capitalizeWords(item.user_name)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}