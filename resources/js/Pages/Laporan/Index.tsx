import { PageProps, FinancialAccount } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
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

const initialHistory = [
    { id: 1, time: '09:00', type: 'TRX', action: 'BELI', desc: 'USD 100 Lembar', stock: '100', amount: -1500000, staff: 'Nabil', payment: 'cash' },
    { id: 2, time: '10:15', type: 'TRX', action: 'JUAL', desc: 'SGD 500 Lembar', stock: '200', amount: 5800000, staff: 'Nabil', payment: 'bca' },
    { id: 3, time: '12:00', type: 'OPS', action: 'OUT', desc: 'Makan Siang', amount: -50000, staff: 'Admin', payment: 'cash' },
];

export default function ReportIndex({ auth, financialAccounts = [] }: PageProps<{ financialAccounts: FinancialAccount[] }>) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Calculate Initial Balances from Props
    const saldoAwalCash = useMemo(() =>
        financialAccounts.filter(acc => acc.type === 'cash').reduce((sum, acc) => sum + Number(acc.balance), 0),
        [financialAccounts]);

    const saldoAwalBca = useMemo(() =>
        financialAccounts.filter(acc => acc.type.toLowerCase().includes('bca')).reduce((sum, acc) => sum + Number(acc.balance), 0),
        [financialAccounts]);

    const saldoAwalMandiri = useMemo(() =>
        financialAccounts.filter(acc => acc.type.toLowerCase().includes('mandiri')).reduce((sum, acc) => sum + Number(acc.balance), 0),
        [financialAccounts]);

    const [summary, setSummary] = useState({
        saldo_awal: saldoAwalCash,
        total_penjualan_tunai: 0,
        total_pembelian_tunai: 0,
        total_pemasukan_tunai: 0,
        total_pengeluaran_tunai: 0,

        saldo_awal_bca: saldoAwalBca,
        total_penjualan_bca: 0,
        total_pembelian_bca: 0,
        total_pemasukan_bca: 0,
        total_pengeluaran_bca: 0,

        saldo_awal_mandiri: saldoAwalMandiri,
        total_penjualan_mandiri: 0,
        total_pembelian_mandiri: 0,
        total_pemasukan_mandiri: 0,
        total_pengeluaran_mandiri: 0,

        total_aset_valas: 0,
        grand_total_kemarin: 0,
    });

    const { data, setData, reset } = useForm({
        type: 'out',
        payment_method: 'cash',
        description: '',
        amount: '',
    });

    const saldoAkhirKas = (summary.saldo_awal || 0)
        + (summary.total_penjualan_tunai || 0)
        - (summary.total_pembelian_tunai || 0)
        + (summary.total_pemasukan_tunai || 0)
        - (summary.total_pengeluaran_tunai || 0);

    const saldoAkhirBca = (summary.saldo_awal_bca || 0)
        + (summary.total_penjualan_bca || 0)
        - (summary.total_pembelian_bca || 0)
        + (summary.total_pemasukan_bca || 0)
        - (summary.total_pengeluaran_bca || 0);

    const saldoAkhirMandiri = (summary.saldo_awal_mandiri || 0)
        + (summary.total_penjualan_mandiri || 0)
        - (summary.total_pembelian_mandiri || 0)
        + (summary.total_pemasukan_mandiri || 0)
        - (summary.total_pengeluaran_mandiri || 0);

    const totalSaldoAkhir = saldoAkhirKas + saldoAkhirBca + saldoAkhirMandiri

    const grandTotalHariIni = saldoAkhirKas
        + saldoAkhirBca
        + saldoAkhirMandiri
        + (summary.total_aset_valas || 0);

    const profitBersih = grandTotalHariIni - (summary.grand_total_kemarin || 0);

    const formatIDR = (val: number) => {
        if (typeof val !== 'number' || isNaN(val)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const formatNumber = (val: number | string) => {
        const num = Number(String(val).replace(/[^0-9]/g, ''));
        if (isNaN(num)) return '';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const handleApplyOps = (e: React.FormEvent) => {
        e.preventDefault();
        const nominal = Number(String(data.amount).replace(/[^0-9]/g, '')) || 0;

        setSummary(prev => {
            const newState = { ...prev };

            // Tentukan target update berdasarkan Payment Method
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
                                    onChange={(e) => setDate(e.target.value)}
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
                                    <span className="flex items-center gap-1"><Landmark className="h-3 w-3" /> Total BCA</span>
                                    <span className="font-mono font-bold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1"><Landmark className="h-3 w-3" /> Total Mandiri</span>
                                    <span className="font-mono font-bold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="">Total Saldo Akhir</span>
                                    <span className="font-mono font-bold">{formatIDR(totalSaldoAkhir)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">Total Saldo Valas</span>
                                    <span className="font-mono font-bold">{formatIDR(summary.total_aset_valas)}</span>
                                </div>
                            </div>

                            <div className="pt-1">
                                <div className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-2 rounded mb-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Grand Total</span>
                                    <span className="font-mono font-black">{formatIDR(grandTotalHariIni)}</span>
                                </div>
                                <div className="flex justify-between text-red-600 px-2">
                                    <span>Grand Total Kemarin</span>
                                    <span className="font-mono font-bold">{formatIDR(summary.grand_total_kemarin)}</span>
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
                                        className="col-span-3 font-mono"
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
                            {/* <div className="flex justify-between">
                                <span>Saldo Awal</span>
                                <span className="font-mono font-bold">{formatIDR(summary.saldo_awal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Penjualan</span>
                                <span className="font-mono font-bold">+ {formatIDR(summary.total_penjualan_tunai)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Pembelian</span>
                                <span className="font-mono font-bold">- {formatIDR(summary.total_pembelian_tunai)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Biaya Ops</span>
                                <span className="font-mono font-bold">- {formatIDR(summary.total_pengeluaran_tunai)}</span>
                            </div>

                            <Separator className="bg-green-200 my-2" /> */}

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
                                    {initialHistory.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs">{item.time}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.type === 'TRX' ? 'default' : 'secondary'}>
                                                    {item.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.action}</span>
                                                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="uppercase text-[10px]">{item.payment}</Badge>
                                            </TableCell>
                                            <TableCell className={`text-right font-mono font-bold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {formatIDR(item.amount)}
                                            </TableCell>
                                            <TableCell className="text-center text-xs">
                                                {item.staff}
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