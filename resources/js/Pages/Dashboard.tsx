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

// data dummy untuk transaksi
type Transaction = {
    id: number;
    code: string;
    date: string;
    customer: string;
    currency: string;
    type: 'buy' | 'sell';
    total: string;
    status: string;
};

// Data Dummy (Nanti diganti data dari Database via Props)
const dummyTransactions: Transaction[] = [
    { id: 1, code: 'TRX-001', date: '10:30 AM', customer: 'Budi Santoso', currency: 'USD', type: 'buy', total: 'Rp 15.000.000', status: 'Success' },
    { id: 2, code: 'TRX-002', date: '11:15 AM', customer: 'Siti Aminah', currency: 'SGD', type: 'sell', total: 'Rp 5.400.000', status: 'Success' },
    { id: 3, code: 'TRX-003', date: '13:00 PM', customer: 'John Doe', currency: 'USD', type: 'buy', total: 'Rp 1.500.000', status: 'Pending' },
    { id: 4, code: 'TRX-004', date: '14:20 PM', customer: 'PT Maju Mundur', currency: 'EUR', type: 'sell', total: 'Rp 25.000.000', status: 'Success' },
];

export default function Dashboard() {
    // State untuk Filter Buy/Sell
    const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');

    // Logic Filter
    const filteredTransactions = dummyTransactions.filter((trx) => {
        if (filterType === 'all') return true;
        return trx.type === filterType;
    });

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
                            <div className="text-2xl font-bold">Rp.100.000.000</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo BCA</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp.100.000.000</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Mandiri</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp.100.000.000</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp.100.000.000</div>
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
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((trx) => (
                                            <tr key={trx.id} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-4 py-3 font-medium">{trx.code}</td>
                                                <td className="px-4 py-3 text-gray-500">{trx.date}</td>
                                                <td className="px-4 py-3">{trx.customer}</td>
                                                <td className="px-4 py-3 font-bold">{trx.currency}</td>
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
                                                <td className="px-4 py-3 text-center">
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                                                        {trx.status}
                                                    </span>
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