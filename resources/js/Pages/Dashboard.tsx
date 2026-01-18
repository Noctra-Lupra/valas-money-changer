import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/Components/ui/card';
import {
    DollarSign,
    CircleDollarSign,
    CreditCard,
    Activity,
    ArrowUpRight,
    ArrowDownLeft,
} from 'lucide-react';

import { PageProps, FinancialAccount } from '@/types';

type Transaction = {
    id: number;
    code: string;
    date: string;
    customer: string;
    currency: string;
    type: 'buy' | 'sell';
    total: string;
};


export default function Dashboard({ auth, financialAccounts = [], recentTransactions = [] }: PageProps<{ financialAccounts: FinancialAccount[], recentTransactions: Transaction[] }>) {
    const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');

    const filteredTransactions = recentTransactions.filter((trx) => {
        const trxDate = new Date(trx.date);
        const today = new Date();
        const isToday = trxDate.getDate() === today.getDate() &&
            trxDate.getMonth() === today.getMonth() &&
            trxDate.getFullYear() === today.getFullYear();

        if (!isToday) return false;

        if (filterType === 'all') return true;
        return trx.type === filterType;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatTitleCase = (str: string) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatWIB = (dateString: string) => {
        if (!dateString) return '-';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return '-';
        }

        return new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta',
            // day: '2-digit',
            // month: 'short',
            // year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };



    const cashBalance = financialAccounts
        .filter(acc => acc.type === 'cash')
        .reduce((sum, acc) => sum + Number(acc.balance), 0);

    const bcaBalance = financialAccounts
        .filter(acc => acc.type.toLowerCase().includes('bca'))
        .reduce((sum, acc) => sum + Number(acc.balance), 0);

    const mandiriBalance = financialAccounts
        .filter(acc => acc.type.toLowerCase().includes('mandiri'))
        .reduce((sum, acc) => sum + Number(acc.balance), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Dashboard
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium text-blue-600 dark:text-blue-400">
                            PT. MONEY CHANGER SEJAHTERA
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                            <CardTitle className="text-sm font-medium">Saldo Awal</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(cashBalance)}</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo BCA Awal</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(bcaBalance)}</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Mandiri Awal</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(mandiriBalance)}</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Grand Total Awal/Kemarin</CardTitle>
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp 0</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-1">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 border-blue-100 dark:border-zinc-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Total Transaksi Hari Ini
                            </CardTitle>
                            <CardDescription>Akumulasi volume transaksi Buy & Sell hari ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                Rp 46.900.000
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="text-green-600 font-medium">↑ 12%</span> dari kemarin
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
                            <CardDescription>
                                Daftar transaksi yang terjadi hari ini (Auto-reset 00:00).
                            </CardDescription>
                        </div>

                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'all'
                                    ? 'bg-white shadow text-gray-900 dark:bg-zinc-700 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('buy')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${filterType === 'buy'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'text-gray-500 hover:text-green-600'
                                    }`}
                            >
                                <ArrowDownLeft className="w-3 h-3" /> Buy
                            </button>
                            <button
                                onClick={() => setFilterType('sell')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${filterType === 'sell'
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    : 'text-gray-500 hover:text-orange-600'
                                    }`}
                            >
                                <ArrowUpRight className="w-3 h-3" /> Sell
                            </button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-zinc-800/50 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Kode TRX</th>
                                        <th className="px-4 py-3">Waktu</th>
                                        <th className="px-4 py-3">Nasabah</th>
                                        <th className="px-4 py-3">Valas</th>
                                        <th className="px-4 py-3">Jenis</th>
                                        <th className="px-4 py-3 text-right">Total (IDR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((trx) => (
                                            <tr key={trx.id} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-4 py-3 font-medium">{trx.code}</td>
                                                <td className="px-4 py-3 text-gray-500">{formatWIB(trx.date)}</td>
                                                <td className="px-4 py-3">{formatTitleCase(trx.customer)}</td>
                                                <td className="px-4 py-3 font-bold">{trx.currency.toUpperCase()}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${trx.type === 'buy'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                        }`}>
                                                        {trx.type === 'buy' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                                        {trx.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold">
                                                    {trx.total}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                Tidak ada transaksi ditemukan untuk filter ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}