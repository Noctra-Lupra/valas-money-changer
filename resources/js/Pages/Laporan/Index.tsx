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
    ArrowDownRight,
    ArrowUpRight,
    Coins,
    ArrowRightLeft,
    ArrowUpCircle,
    ArrowDownCircle
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

            <div className="flex flex-col gap-8 w-full px-6 py-2 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Rekapitulasi Harian</h1>
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="h-4 w-4" />
                            <Input
                                type="date"
                                className="h-8 w-auto border-none bg-transparent p-0 font-medium focus-visible:ring-0 shadow-none text-base dark:text-gray-200"
                                value={date}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="h-10 px-4 gap-2 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200">
                            <Printer className="h-4 w-4" /> Cetak
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="h-10 px-4 gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-sm">
                                    <Lock className="h-4 w-4" /> End Shift
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi End Shift</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-lg space-y-2 mt-2 border border-gray-100 dark:border-zinc-800">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Profit Bersih</span>
                                                <span className={`font-bold text-lg ${profitBersih >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{formatIDR(profitBersih)}</span>
                                            </div>
                                            <Separator className="dark:bg-zinc-700" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Grand Total Aset</span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">{formatIDR(grandTotalHariIni)}</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                            Data hari ini akan dikunci dan saldo akhir akan menjadi saldo awal untuk hari berikutnya.
                                        </p>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleEndShift} className="bg-rose-600 hover:bg-rose-700">Ya, Tutup Shift</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm border-0 ring-1 ring-gray-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        Laporan Arus Kas
                                    </CardTitle>
                                    <CardDescription className="dark:text-gray-400">Pergerakan uang tunai (Cash Only)</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100">CASHFLOW</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Awal</span>
                                <span className="font-bold text-gray-900 dark:text-gray-100">{formatIDR(saldo_awal.cash)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><ArrowDownRight className="h-3 w-3 text-green-500" /> Penjualan</span>
                                        <span className="font-medium text-green-600 dark:text-green-500">+{formatDisplayNumber(mutations.salesCash)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        {/* <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><ArrowDownRight className="h-3 w-3 text-blue-500" /> Ops Masuk</span>
                                        <span className="font-medium text-blue-600 dark:text-blue-400">+{formatDisplayNumber(summary.total_pemasukan_tunai)}</span> */}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-red-500" /> Pembelian</span>
                                        <span className="font-medium text-red-600 dark:text-red-500">-{formatDisplayNumber(mutations.buyCash)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        {/* <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-orange-500" /> Ops Keluar</span>
                                        <span className="font-medium text-orange-600 dark:text-orange-500">-{formatDisplayNumber(summary.total_pengeluaran_tunai)}</span> */}
                                    </div>
                                </div>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="flex justify-between items-end">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Saldo Akhir Cash</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatIDR(saldoAkhirKas)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-0 ring-1 ring-gray-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <Landmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        Laporan Bank
                                    </CardTitle>
                                    <CardDescription className="dark:text-gray-400">Mutasi BCA & Mandiri</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100">BANKFLOW</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Saldo BCA Awal</span>
                                    <span className="font-bold">{formatDisplayNumber(saldo_awal.bca)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="text-green-600 dark:text-green-500">+ Masuk: {formatDisplayNumber((mutations.salesBca || 0) + (summary.total_pemasukan_bca || 0))}</span>
                                    <span className="text-red-600 dark:text-red-500 text-right">- Keluar: {formatDisplayNumber((mutations.buyBca || 0) + (summary.total_pengeluaran_bca || 0))}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                    <span className="uppercase font-semibold text-white">Saldo Akhir BCA</span>
                                    <span className="font-bold text-yellow-900 dark:text-white/80">{formatIDR(saldoAkhirBca)}</span>
                                </div>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Saldo Mandiri Awal</span>
                                    <span className="font-bold">{formatDisplayNumber(saldo_awal.mandiri)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="text-green-600 dark:text-green-500">+ Masuk: {formatDisplayNumber((mutations.salesMandiri || 0) + (summary.total_pemasukan_mandiri || 0))}</span>
                                    <span className="text-red-600 dark:text-red-500 text-right">- Keluar: {formatDisplayNumber((mutations.buyMandiri || 0) + (summary.total_pengeluaran_mandiri || 0))}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                    <span className="uppercase font-semibold text-white">Saldo Akhir Mandiri</span>
                                    <span className="font-bold text-yellow-900 dark:text-white/80">{formatIDR(saldoAkhirMandiri)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-0 ring-1 ring-gray-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        Profit & Grand Total
                                    </CardTitle>
                                    <CardDescription className="dark:text-gray-400">Kekayaan bersih & keuntungan</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-100">PROFITABILITY</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Total Pembelian</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatIDR(totalSemuaPembelian)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Total Penjualan</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatIDR(totalSemuaPenjualan)}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 space-y-3 border border-gray-100 dark:border-zinc-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Wallet className="h-3 w-3" /> Total BCA</span>
                                    <span className={`font-bold ${((mutations.salesBca || 0) - (mutations.buyBca || 0) + (summary.total_pemasukan_bca || 0) - (summary.total_pengeluaran_bca || 0)) < 0 ? 'text-red-600' : 'text-white/80'}`}>
                                        {formatIDR((mutations.salesBca || 0) - (mutations.buyBca || 0) + (summary.total_pemasukan_bca || 0) - (summary.total_pengeluaran_bca || 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Landmark className="h-3 w-3" /> Total Mandiri</span>
                                    <span className={`font-bold ${((mutations.salesMandiri || 0) - (mutations.buyMandiri || 0) + (summary.total_pemasukan_mandiri || 0) - (summary.total_pengeluaran_mandiri || 0)) < 0 ? 'text-red-600' : 'text-white/80'}`}>
                                        {formatIDR((mutations.salesMandiri || 0) - (mutations.buyMandiri || 0) + (summary.total_pemasukan_mandiri || 0) - (summary.total_pengeluaran_mandiri || 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Landmark className="h-3 w-3" /> Total Saldo Akhir</span>
                                    <span className="font-medium dark:text-gray-200">{formatIDR(totalSaldoAkhir)}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-zinc-700">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Coins className="h-3 w-3" /> Total Saldo Valas</span>
                                    <span className="font-medium dark:text-gray-200">{formatIDR(totals.asset_valas)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Grand Total Hari Ini</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatIDR(grandTotalHariIni)}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Profit Bersih</p>
                                    <p className={`text-xl font-bold ${profitBersih >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {profitBersih > 0 && '+'}{formatIDR(profitBersih)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={`w-full max-w-2xl shadow-sm border-0 ring-1 ring-gray-200 dark:ring-zinc-800  bg-white dark:bg-zinc-900 transition-all duration-300`}>
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
                            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
                                <ArrowRightLeft className={`h-4 w-4`} />
                                Input Operasional
                            </CardTitle>
                            <CardDescription className="text-center dark:text-gray-400">Catat biaya operasional & pemasukan lain</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 px-8">
                            <form onSubmit={handleApplyOps} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Jenis Transaksi</Label>
                                        <Select onValueChange={(val) => setData('type', val)} defaultValue="out">
                                            <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="out" className="text-red-600 dark:text-red-400 font-medium">🔴 Pengeluaran</SelectItem>
                                                <SelectItem value="in" className="text-green-600 dark:text-green-400 font-medium">🟢 Pemasukan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sumber Dana</Label>
                                        <Select onValueChange={(val) => setData('payment_method', val)} defaultValue="cash">
                                            <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">💵 Cash / Tunai</SelectItem>
                                                <SelectItem value="bca">🏦 Bank BCA</SelectItem>
                                                <SelectItem value="bca2">🏦 Bank BCA 2</SelectItem>
                                                <SelectItem value="mandiri">🏦 Bank Mandiri</SelectItem>
                                                <SelectItem value="mandiri2">🏦 Bank Mandiri 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nominal (Rp)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 font-bold text-lg">Rp</span>
                                            <Input
                                                className="pl-10 h-14 font-bold text-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                                                placeholder="0"
                                                value={formatNumber(data.amount)}
                                                onChange={(e) => setData('amount', e.target.value.replace(/\./g, ''))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Keterangan</Label>
                                        <Input
                                            className="h-10 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                                            placeholder="Contoh: Beli bensin, Makan siang..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className={`w-full font-bold h-12 shadow-sm transition-all text-base`}
                                        disabled={!data.amount || !data.description}
                                    >
                                        {data.type === 'out' ? 'SIMPAN PENGELUARAN' : 'SIMPAN PEMASUKAN'}
                                    </Button>
                                </div>
                            </form>
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
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-6 text-sm text-muted-foreground"
                                            >
                                                Tidak ada data transaksi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-xs whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{item.invoice_number}</span>
                                                        <span className="text-gray-500">
                                                            {formatWIB(item.formatted_time)}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={item.transaction_type === 'buy' ? 'default' : 'secondary'}
                                                        className={
                                                            item.transaction_type === 'buy'
                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                : 'bg-orange-600 hover:bg-orange-700'
                                                        }
                                                    >
                                                        {item.transaction_type.toUpperCase()}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {capitalizeWords(item.customer)}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {item.currency_code.toUpperCase()}{" "}
                                                            {formatDisplayNumber(item.amount_valas)} (Kurs:{" "}
                                                            {formatDisplayNumber(item.rate)})
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="uppercase text-[10px]">
                                                        {item.payment_method}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell
                                                    className={`text-right font-bold ${item.transaction_type === 'buy'
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                        }`}
                                                >
                                                    {item.transaction_type === 'buy' ? '-' : '+'}{" "}
                                                    {formatIDR(item.total_idr)}
                                                </TableCell>

                                                <TableCell className="text-center text-xs">
                                                    {capitalizeWords(item.user_name)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>

                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}