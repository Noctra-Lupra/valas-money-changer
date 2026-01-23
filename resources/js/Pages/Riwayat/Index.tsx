import InvoiceTemplate, { Transaction } from '@/Components/InvoiceTemplate';
import { Badge } from '@/Components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Printer, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PaginatedData } from '@/types';

interface Props {
    transactions: PaginatedData<Transaction>;
    filters: {
        search?: string;
        type?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function RiwayatIndex({ transactions, filters }: Props) {
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                route('riwayat.index'),
                {
                    search: search,
                    type: typeFilter === 'all' ? undefined : typeFilter,
                    start_date: startDate || undefined,
                    end_date: endDate || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, typeFilter, startDate, endDate]);

    const formatIDR = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    const handlePrint = (transactionId: number) => {
        window.open(route('riwayat.print', transactionId), '_blank');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Riwayat Transaksi & Nota
                </h2>
            }
        >
            <Head title="Riwayat Transaksi" />

            <div className="mx-auto w-full max-w-7xl">
                <Card>
                    <CardHeader className="space-y-0">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Daftar Transaksi</CardTitle>
                                <CardDescription>
                                    Lihat riwayat transaksi dan cetak ulang
                                    nota.
                                </CardDescription>
                            </div>
                            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                                <div className="flex lg:gap-2 items-center">
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="w-full md:w-[150px]"
                                    />
                                    <span>-</span>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="w-full md:w-[150px]"
                                    />
                                </div>
                                <Select
                                    value={typeFilter}
                                    onValueChange={(val) => setTypeFilter(val)}
                                >
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder="Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Tipe
                                        </SelectItem>
                                        <SelectItem value="buy">
                                            Beli (Masuk)
                                        </SelectItem>
                                        <SelectItem value="sell">
                                            Jual (Keluar)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari Invoice/Nasabah..."
                                        className="pl-9"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Nasabah</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Valas</TableHead>
                                    <TableHead className="text-right">
                                        Kurs
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Pembayaran
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total (IDR)
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada transaksi data.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.data.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-mono font-medium">
                                                {transaction.invoice_number}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    transaction.created_at,
                                                ).toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.customer_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        transaction.type ===
                                                        'buy'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        transaction.type ===
                                                        'buy'
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-orange-600 text-white hover:bg-orange-700'
                                                    }
                                                >
                                                    {transaction.type === 'buy'
                                                        ? 'BELI'
                                                        : 'JUAL'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {transaction.currency.code}{' '}
                                                <span className="text-xs text-muted-foreground">
                                                    x {transaction.amount}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatIDR(transaction.rate)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="uppercase"
                                                >
                                                    {transaction
                                                        .financial_account
                                                        ?.type || 'CASH'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {formatIDR(
                                                    transaction.total_idr,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setSelectedTransaction(
                                                                        transaction,
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                Preview
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Preview Nota
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="overflow-x-auto py-4">
                                                                {selectedTransaction && (
                                                                    <InvoiceTemplate
                                                                        transaction={
                                                                            selectedTransaction
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    onClick={() =>
                                                                        selectedTransaction &&
                                                                        handlePrint(
                                                                            selectedTransaction.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Printer className="mr-2 h-4 w-4" />
                                                                    Cetak Nota
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handlePrint(
                                                                transaction.id,
                                                            )
                                                        }
                                                    >
                                                        <Printer className="h-4 w-4 text-muted-foreground hover:text-black" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {transactions.from} to {transactions.to}{' '}
                                of {transactions.total} results
                            </div>
                            <div className="flex gap-1">
                                {transactions.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        } ${!link.url && 'pointer-events-none opacity-50'}`}
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
