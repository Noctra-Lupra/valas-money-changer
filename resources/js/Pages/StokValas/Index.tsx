import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Button } from '@/Components/ui/button';
import {
    Search,
    Package,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2
} from 'lucide-react';
import { Currency } from '@/types';
import { toast } from 'sonner';

// type StockItem = {
//     id: number;
//     code: string;
//     name: string;
//     stock_amount: number;
//     average_rate: number;
//     updated_at: string;
// };

interface Props {
    stocks: Currency[];
}

export default function StockValas({ stocks }: Props) {
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredStocks = useMemo(() => {
        return stocks.filter((item) =>
            item.code.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, stocks]);

    const totalValuation = filteredStocks.reduce((acc, item) => acc + (Number(item.stock_amount) * Number(item.average_rate)), 0);
    const totalSheets = filteredStocks.reduce((acc, item) => acc + Number(item.stock_amount), 0);

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const formatNum = (val: number) => new Intl.NumberFormat('id-ID').format(val);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

        if (isToday) return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        if (isYesterday) return 'Kemarin';
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        code: '',
        name: '',
    });

    const handleSaveNew = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stok-valas.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
                toast.success('Valas baru berhasil ditambahkan.');
            },
            onError: () => {
                toast.error('Valas baru gagal ditambahkan.');
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Stok Valas (Inventory)
                </h2>
            }
        >
            <Head title="Stok Valas" />

            <div className="flex flex-col gap-6 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Valuasi Aset</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatIDR(totalValuation)}</div>
                            <p className="text-xs text-blue-600/70 dark:text-blue-400">Estimasi nilai stok dalam Rupiah</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lembar Fisik</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNum(totalSheets)}</div>
                            <p className="text-xs text-muted-foreground">Lembar valas di brankas</p>
                        </CardContent>
                    </Card>


                </div>

                <Card className="shadow-md">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Data Stok Per Varian</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Stok bertambah saat BELI dan berkurang saat JUAL.</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari Kode..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Button
                                className="bg-white/90 hover:bg-white/80"
                                onClick={() => setIsAddOpen(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Valas
                            </Button>

                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Tambah Varian Valas</DialogTitle>
                                        <DialogDescription>
                                            Masukkan detail mata uang baru yang akan diperdagangkan.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSaveNew}>
                                        <div className="grid grid-cols-4 py-2 items-center gap-4">
                                            <Label htmlFor="code" className="text-right">
                                                Kode
                                            </Label>
                                            <Input
                                                id="code"
                                                placeholder="Misal: USD"
                                                className="col-span-3 uppercase"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Nama
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Opsional (kosongkan dengan -)"
                                                className="col-span-3"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <DialogFooter className='mt-5'>
                                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                                            <Button type="submit" disabled={processing}>Simpan Valas</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Kode</TableHead>
                                        <TableHead>Nama Mata Uang</TableHead>
                                        <TableHead className="text-right">Jumlah Stok</TableHead>
                                        <TableHead className="text-right">Rata-rata Modal</TableHead>
                                        <TableHead className="text-right">Total Nilai</TableHead>
                                        <TableHead className="text-center w-[120px]">Last Update</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStocks.length > 0 ? (
                                        filteredStocks.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                                                <TableCell className="font-bold font-mono text-base">
                                                    {item.code.toUpperCase()}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.name}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-base">
                                                    {formatNum(item.stock_amount)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {item.stock_amount > 0 ? formatNum(item.average_rate) : '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-green-700 dark:text-green-400">
                                                    {item.stock_amount > 0 ? formatIDR(item.stock_amount * item.average_rate) : '-'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.stock_amount > 0 ? (
                                                        <span className="text-xs text-muted-foreground">{formatDate(item.updated_at)}</span>
                                                    ) : (
                                                        <span className="text-[15px] text-red-500 font-bold">Habis</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <AlertCircle className="h-8 w-8 opacity-20" />
                                                    Tidak ada data stok ditemukan.
                                                </div>
                                            </TableCell>
                                        </TableRow>
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