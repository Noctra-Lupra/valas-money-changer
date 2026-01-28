import * as React from 'react';

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
} from '@/Components/ui/alert-dialog';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, ReportData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowRightLeft,
    ArrowUpRight,
    Banknote,
    CalendarIcon,
    Coins,
    Landmark,
    Lock,
    Printer,
    Trash2,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';

interface ExtendedReportData extends ReportData {
    totals: {
        buy: number;
        sales: number;
        total_money: number;
        asset_valas: number;
    };
    saldo_akhir?: {
        cash: number;
        bca: number;
        mandiri: number;
    };
}

export default function ReportIndex({
    auth,
    date,
    reportData,
    grandTotalHariIni: backendGrandTotal,
    yesterdayGrandTotal = 0,
    isClosed = false,
}: PageProps<{
    date: string;
    reportData: ExtendedReportData;
    grandTotalHariIni: number;
    yesterdayGrandTotal: number;
    isClosed: boolean;
}>) {
    const { saldo_awal, mutations, totals, transactions, ops } = reportData;

    const transactionData = transactions?.data ?? [];
    const links = transactions?.links ?? [];
    const from = transactions?.from ?? 0;
    const to = transactions?.to ?? 0;
    const total = transactions?.total ?? 0;

    const { data, setData, reset } = useForm({
        type: 'out',
        payment_method: 'cash',
        description: '',
        amount: '',
    });

    const totalSemuaPembelian = totals.buy;
    const totalSemuaPenjualan = totals.sales;

    const saldoAkhirKas =
        reportData.saldo_akhir?.cash ??
        (saldo_awal.cash || 0) +
            (mutations.salesCash || 0) -
            (mutations.buyCash || 0) +
            (ops?.cash_in || 0) -
            (ops?.cash_out || 0) +
            (ops?.transfer_from_bank_to_cash || 0) -
            (ops?.transfer_to_bank || 0);

    const saldoAkhirBca =
        reportData.saldo_akhir?.bca ??
        (saldo_awal.bca || 0) +
            (mutations.salesBca || 0) -
            (mutations.buyBca || 0) +
            (ops?.bca_in || 0) -
            (ops?.bca_out || 0);

    const saldoAkhirMandiri =
        reportData.saldo_akhir?.mandiri ??
        (saldo_awal.mandiri || 0) +
            (mutations.salesMandiri || 0) -
            (mutations.buyMandiri || 0) +
            (ops?.mandiri_in || 0) -
            (ops?.mandiri_out || 0);

    const totalSaldoAkhir = totals.total_money;

    const grandTotalHariIni = backendGrandTotal;

    const profitBersih = grandTotalHariIni - yesterdayGrandTotal;

    const handleDateChange = (val: string) => {
        router.get(
            route('laporan.index'),
            { date: val },
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatIDR = (val: number | string) => {
        const num = Number(val);
        if (isNaN(num)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
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
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleApplyOps = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('laporan.store'), data, {
            onSuccess: () => {
                reset();
                toast.success('Data operasional berhasil disimpan');
            },
            onError: () => {
                toast.error('Data operasional gagal disimpan');
            },
            preserveScroll: true,
        });
    };

    const handleEndShift = () => {
        router.post(
            route('laporan.end-shift'),
            {},
            {
                preserveState: false,
                onError: (errors: any) => {
                    toast.error(errors.message || 'Gagal menutup shift');
                },
            },
        );
    };

    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    const confirmDelete = (id: string | number) => {
        setDeleteId(id);
    };

    const executeDelete = () => {
        if (!deleteId) return;

        router.delete(route('laporan.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Data berhasil dihapus');
                setDeleteId(null);
            },
            onError: (err: any) => {
                toast.error(
                    err?.props?.errors?.message || 'Gagal menghapus data',
                );
                setDeleteId(null);
            },
            preserveScroll: true,
        });
    };

    const todayDate = new Date();
    const todayString = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    const isToday = date === todayString;

    const selectedDate = React.useMemo(() => {
        return date ? new Date(date) : undefined;
    }, [date]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Laporan Harian & Audit
                </h2>
            }
        >
            <Head title="Laporan Harian" />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data ini? Tindakan
                            ini akan mengembalikan stok/saldo jika data yang
                            dihapus adalah transaksi, dan tidak dapat
                            dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={false}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus Data
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex min-h-screen w-full flex-col gap-8 px-6 py-2">
                <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Rekapitulasi Harian
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex h-8 items-center gap-3 bg-transparent p-0 text-base font-medium text-gray-500 outline-none hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {selectedDate ? (
                                            <span className="text-gray-900 dark:text-gray-200">
                                                {format(
                                                    selectedDate,
                                                    'dd-MM-yyyy',
                                                )}
                                            </span>
                                        ) : (
                                            <span>Pilih tanggal</span>
                                        )}
                                    </button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(d) => {
                                            if (!d) return;
                                            handleDateChange(
                                                format(d, 'yyyy-MM-dd'),
                                            );
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex w-full gap-3 md:w-auto">
                        {/* <Button
                            variant="outline"
                            className="h-10 gap-2 border-gray-300 px-4 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
                        >
                            <Printer className="h-4 w-4" /> Cetak
                        </Button> */}
                        <Button
                            variant="outline"
                            className="h-10 gap-2 border-green-600 px-4 text-green-700 hover:bg-green-50 dark:border-green-800 dark:bg-zinc-800 dark:text-green-500 hover:dark:bg-green-900/20"
                            asChild
                        >
                            <a
                                href={route('laporan.export', { date: date })}
                                target="_blank"
                            >
                                <Printer className="h-4 w-4" /> Export Excel
                            </a>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    disabled={isClosed}
                                    className="h-10 gap-2 bg-rose-600 px-4 text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
                                >
                                    <Lock className="h-4 w-4" />{' '}
                                    {isClosed ? 'Shift Closed' : 'End Shift'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Konfirmasi End Shift
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <div className="mt-2 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Profit Bersih
                                                </span>
                                                <span
                                                    className={`text-lg font-bold ${profitBersih >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
                                                >
                                                    {formatIDR(profitBersih)}
                                                </span>
                                            </div>
                                            <Separator className="dark:bg-zinc-700" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Grand Total Aset
                                                </span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                                    {formatIDR(
                                                        grandTotalHariIni,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                            Data hari ini akan dikunci dan saldo
                                            akhir akan menjadi saldo awal untuk
                                            hari berikutnya.
                                        </p>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleEndShift}
                                        className="bg-rose-600 hover:bg-rose-700"
                                    >
                                        Ya, Tutup Shift
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="border-0 bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                        <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        Laporan Arus Kas
                                    </CardTitle>
                                    <CardDescription className="dark:text-gray-400">
                                        Pergerakan uang tunai (Cash Only)
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                    CASHFLOW
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Saldo Awal
                                </span>
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                    {formatIDR(saldo_awal.cash)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <ArrowDownRight className="h-3 w-3 text-green-500" />{' '}
                                            Penjualan
                                        </span>
                                        <span className="font-medium text-green-600 dark:text-green-500">
                                            +
                                            {formatDisplayNumber(
                                                mutations.salesCash,
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <ArrowUpRight className="h-3 w-3 text-red-500" />{' '}
                                            Pembelian
                                        </span>
                                        <span className="font-medium text-red-600 dark:text-red-500">
                                            -
                                            {formatDisplayNumber(
                                                mutations.buyCash,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="flex items-end justify-between">
                                <span className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                    Saldo Akhir Cash
                                </span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {formatIDR(saldoAkhirKas)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                        <Landmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        Laporan Bank
                                    </CardTitle>
                                    <CardDescription className="dark:text-gray-400">
                                        Mutasi BCA & Mandiri
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
                                >
                                    BANKFLOW
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Saldo BCA Awal
                                    </span>
                                    <span className="font-bold">
                                        {formatDisplayNumber(saldo_awal.bca)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="text-green-600 dark:text-green-500">
                                        + Masuk:{' '}
                                        {formatDisplayNumber(
                                            (mutations.salesBca || 0) +
                                                (ops?.bca_in || 0),
                                        )}
                                    </span>
                                    <span className="text-right text-red-600 dark:text-red-500">
                                        - Keluar:{' '}
                                        {formatDisplayNumber(
                                            (mutations.buyBca || 0) +
                                                (ops?.bca_out || 0),
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-zinc-800 dark:bg-zinc-800/50">
                                    <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                                        Saldo Akhir BCA
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white/80">
                                        {formatIDR(saldoAkhirBca)}
                                    </span>
                                </div>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                        Saldo Mandiri Awal
                                    </span>
                                    <span className="font-bold">
                                        {formatDisplayNumber(
                                            saldo_awal.mandiri,
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="text-green-600 dark:text-green-500">
                                        + Masuk:{' '}
                                        {formatDisplayNumber(
                                            (mutations.salesMandiri || 0) +
                                                (ops?.mandiri_in || 0),
                                        )}
                                    </span>
                                    <span className="text-right text-red-600 dark:text-red-500">
                                        - Keluar:{' '}
                                        {formatDisplayNumber(
                                            (mutations.buyMandiri || 0) +
                                                (ops?.mandiri_out || 0),
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-zinc-800 dark:bg-zinc-800/50">
                                    <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                                        Saldo Akhir Mandiri
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white/80">
                                        {formatIDR(saldoAkhirMandiri)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        Profit & Grand Total
                                    </CardTitle>
                                    <CardDescription className="dark:text-gray-400">
                                        Kekayaan bersih & keuntungan
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                                >
                                    PROFITABILITY
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Total Pembelian
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatIDR(totalSemuaPembelian)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Total Penjualan
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatIDR(totalSemuaPenjualan)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Wallet className="h-3 w-3" /> Total BCA
                                    </span>
                                    <span
                                        className={`font-bold ${(mutations.salesBca || 0) - (mutations.buyBca || 0) + (ops?.bca_in || 0) - (ops?.bca_out || 0) < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white/80'}`}
                                    >
                                        {formatIDR(
                                            (mutations.salesBca || 0) -
                                                (mutations.buyBca || 0) +
                                                (ops?.bca_in || 0) -
                                                (ops?.bca_out || 0),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Landmark className="h-3 w-3" /> Total
                                        Mandiri
                                    </span>
                                    <span
                                        className={`font-bold ${(mutations.salesMandiri || 0) - (mutations.buyMandiri || 0) + (ops?.mandiri_in || 0) - (ops?.mandiri_out || 0) < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white/80'}`}
                                    >
                                        {formatIDR(
                                            (mutations.salesMandiri || 0) -
                                                (mutations.buyMandiri || 0) +
                                                (ops?.mandiri_in || 0) -
                                                (ops?.mandiri_out || 0),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Landmark className="h-3 w-3" /> Total
                                        Saldo Akhir
                                    </span>
                                    <span className="font-medium dark:text-gray-200">
                                        {formatIDR(totalSaldoAkhir)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 text-sm dark:border-zinc-700">
                                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Coins className="h-3 w-3" /> Total
                                        Saldo Valas
                                    </span>
                                    <span className="font-medium dark:text-gray-200">
                                        {formatIDR(totals.asset_valas)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Grand Total Hari Ini
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {formatIDR(grandTotalHariIni)}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                        Profit Bersih
                                    </p>
                                    <p
                                        className={`text-xl font-bold ${profitBersih >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                                    >
                                        {profitBersih > 0 && '+'}
                                        {formatIDR(profitBersih)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`w-full max-w-2xl border-0 bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 dark:bg-zinc-900 dark:ring-zinc-800`}
                    >
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                            <CardTitle className="flex items-center justify-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <ArrowRightLeft className={`h-4 w-4`} />
                                Input Operasional
                            </CardTitle>
                            <CardDescription className="text-center dark:text-gray-400">
                                Catat biaya operasional & pemasukan lain
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pt-6">
                            <form
                                onSubmit={handleApplyOps}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Jenis Transaksi
                                        </Label>
                                        <Select
                                            onValueChange={(val) =>
                                                setData('type', val)
                                            }
                                            defaultValue="out"
                                        >
                                            <SelectTrigger className="h-10 border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="out"
                                                    className="font-medium text-red-600 dark:text-red-400"
                                                >
                                                    🔴 Pengeluaran
                                                </SelectItem>
                                                <SelectItem
                                                    value="in"
                                                    className="font-medium text-green-600 dark:text-green-400"
                                                >
                                                    🟢 Pemasukan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Sumber Dana
                                        </Label>
                                        <Select
                                            onValueChange={(val) =>
                                                setData('payment_method', val)
                                            }
                                            defaultValue="cash"
                                        >
                                            <SelectTrigger className="h-10 border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">
                                                    💵 Cash / Tunai
                                                </SelectItem>
                                                <SelectItem value="bca">
                                                    🏦 Bank BCA
                                                </SelectItem>
                                                <SelectItem value="bca2">
                                                    🏦 Bank BCA 2
                                                </SelectItem>
                                                <SelectItem value="mandiri">
                                                    🏦 Bank Mandiri
                                                </SelectItem>
                                                <SelectItem value="mandiri2">
                                                    🏦 Bank Mandiri 2
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Nominal (Rp)
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-lg font-bold text-gray-500 dark:text-gray-400">
                                                Rp
                                            </span>
                                            <Input
                                                className="h-14 border-gray-200 bg-white pl-10 text-xl font-bold text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
                                                placeholder="0"
                                                value={formatNumber(
                                                    data.amount,
                                                )}
                                                onChange={(e) =>
                                                    setData(
                                                        'amount',
                                                        e.target.value.replace(
                                                            /\./g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Keterangan
                                        </Label>
                                        <Input
                                            className="h-10 border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                                            placeholder="Contoh: Beli bensin, Makan siang..."
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className={`h-12 w-full text-base font-bold shadow-sm transition-all`}
                                        disabled={
                                            !data.amount ||
                                            !data.description ||
                                            isClosed
                                        }
                                    >
                                        {data.type === 'out'
                                            ? 'SIMPAN PENGELUARAN'
                                            : 'SIMPAN PEMASUKAN'}
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
                                        <TableHead className="w-[100px]">
                                            Waktu
                                        </TableHead>
                                        <TableHead className="w-[100px]">
                                            Tipe
                                        </TableHead>
                                        <TableHead>
                                            Deskripsi / Nasabah
                                        </TableHead>
                                        <TableHead className="w-[100px] text-center">
                                            Metode
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Nominal (IDR)
                                        </TableHead>
                                        <TableHead className="w-[120px] text-center">
                                            User
                                        </TableHead>
                                        <TableHead className="w-[50px] text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactionData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-6 text-center text-sm text-muted-foreground"
                                            >
                                                Tidak ada data transaksi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactionData.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="whitespace-nowrap text-xs">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">
                                                            {
                                                                item.invoice_number
                                                            }
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {formatWIB(
                                                                item.formatted_time,
                                                            )}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            [
                                                                'in',
                                                                'out',
                                                            ].includes(
                                                                item.transaction_type,
                                                            )
                                                                ? 'border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300'
                                                                : item.transaction_type ===
                                                                    'buy'
                                                                  ? 'border-transparent bg-blue-600 text-white hover:bg-blue-700'
                                                                  : 'border-transparent bg-orange-600 text-white hover:bg-orange-700'
                                                        }
                                                    >
                                                        {item.transaction_type.toUpperCase()}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {capitalizeWords(
                                                                item.customer,
                                                            )}
                                                        </span>
                                                        {!item.is_operational && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {item.currency_code.toUpperCase()}{' '}
                                                                {formatDisplayNumber(
                                                                    item.amount_valas,
                                                                )}{' '}
                                                                (Kurs:{' '}
                                                                {formatDisplayNumber(
                                                                    item.rate,
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] uppercase"
                                                    >
                                                        {item.payment_method}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell
                                                    className={`text-right font-bold ${
                                                        ['buy', 'out'].includes(
                                                            item.transaction_type,
                                                        )
                                                            ? 'text-red-600 dark:text-red-500'
                                                            : 'text-green-600 dark:text-green-500'
                                                    }`}
                                                >
                                                    {['buy', 'out'].includes(
                                                        item.transaction_type,
                                                    )
                                                        ? '-'
                                                        : '+'}{' '}
                                                    {formatIDR(item.total_idr)}
                                                </TableCell>

                                                <TableCell className="text-center text-xs">
                                                    {capitalizeWords(
                                                        item.user_name,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {isToday && !isClosed && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {from} to {to} of {total} results
                            </div>

                            <div className="flex gap-1">
                                {links.map((link: any, i: number) => (
                                    <Button
                                        key={i}
                                        size="sm"
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                },
                                            )
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
