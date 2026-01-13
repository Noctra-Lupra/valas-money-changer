import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { Printer, Save, X } from 'lucide-react';

const currencies = [
    { id: 1, code: 'USD', buy_rate: 15000, sell_rate: 15200 },
    { id: 2, code: 'SGD', buy_rate: 11500, sell_rate: 11650 },
    { id: 3, code: 'EUR', buy_rate: 16200, sell_rate: 16400 },
    { id: 4, code: 'MYR', buy_rate: 3400, sell_rate: 3500 },
];

export default function Transaksi() {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');

    const [amount, setAmount] = useState<number | string>('');
    const [customRate, setCustomRate] = useState<number | string>(currencies[0].buy_rate);
    const [total, setTotal] = useState<number>(0);

    const { data, setData, reset } = useForm({
        customer_name: '',
        currency_id: currencies[0].id,
        type: 'buy',
        amount: '',
        rate: '',
        total_idr: '',
        payment_method: 'cash',
    });

    useEffect(() => {
        const defaultRate = mode === 'buy' ? selectedCurrency.buy_rate : selectedCurrency.sell_rate;
        setCustomRate(defaultRate);
    }, [selectedCurrency, mode]);

    useEffect(() => {
        const numAmount = Number(String(amount).replace(/[^0-9]/g, '')) || 0;
        const numRate = Number(String(customRate).replace(/[^0-9]/g, '')) || 0;
        const hitungTotal = numAmount * numRate;

        setTotal(hitungTotal);

        setData((prev) => ({
            ...prev,
            amount: String(numAmount),
            rate: String(numRate),
            total_idr: String(hitungTotal),
            type: mode,
            currency_id: selectedCurrency.id,
        }));
    }, [amount, customRate, mode, selectedCurrency]);

    const formatIDR = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const formatNumber = (val: number | string) => {
        if (!val) return '';
        return new Intl.NumberFormat('id-ID').format(Number(String(val).replace(/[^0-9]/g, '')));
    };

    const handleReset = () => {
        reset();
        setAmount('');
        setCustomRate(mode === 'buy' ? selectedCurrency.buy_rate : selectedCurrency.sell_rate);
        setTotal(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Data dikirim ke server:\n" + JSON.stringify(data, null, 2));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Kasir Transaksi
                </h2>
            }
        >
            <Head title="Transaksi Baru" />

            <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
                <form onSubmit={handleSubmit}>
                    <Card className="shadow-md border-t-4 border-t-blue-600">
                        <CardHeader>
                            <CardTitle>Input Data Transaksi</CardTitle>
                            <CardDescription>Masukkan detail transaksi valuta asing.</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-4">
                                    <Label className="mb-2 block">Jenis Transaksi</Label>
                                    <Tabs
                                        defaultValue="buy"
                                        onValueChange={(val) => setMode(val as 'buy' | 'sell')}
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-2 h-11">
                                            <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                                                BELI
                                            </TabsTrigger>
                                            <TabsTrigger value="sell" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                                                JUAL
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                <div className="md:col-span-5 space-y-2">
                                    <Label htmlFor="customer">Nama Nasabah</Label>
                                    <Input
                                        id="customer"
                                        placeholder="Nama Lengkap..."
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                <div className="md:col-span-3 space-y-2">
                                    <Label>Pembayaran</Label>
                                    <Select
                                        onValueChange={(val) => setData('payment_method', val)}
                                        defaultValue={data.payment_method}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">💵 CASH</SelectItem>
                                            <SelectItem value="bca">🏦 BCA</SelectItem>
                                            <SelectItem value="mandiri">🏦 MANDIRI</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator className="my-2" />

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
                                <div className="md:col-span-3 space-y-2">
                                    <Label className="text-muted-foreground">Mata Uang</Label>
                                    <Select
                                        onValueChange={(val) => {
                                            const curr = currencies.find((c) => c.code === val);
                                            if (curr) setSelectedCurrency(curr);
                                        }}
                                        defaultValue={selectedCurrency.code}
                                    >
                                        <SelectTrigger className="h-14 text-xl font-bold">
                                            <SelectValue placeholder="Valas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((curr) => (
                                                <SelectItem key={curr.id} value={curr.code}>
                                                    {curr.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="md:col-span-9 flex items-end gap-3">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-muted-foreground">Jumlah ({selectedCurrency.code})</Label>
                                        <Input
                                            type="text"
                                            placeholder="0"
                                            className="h-14 text-2xl font-bold text-center"
                                            value={formatNumber(amount)}
                                            onChange={(e) => setAmount(e.target.value.replace(/\./g, ''))}
                                        />
                                    </div>

                                    <div className="h-14 flex items-center justify-center px-1">
                                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1.5">
                                            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <Label className="text-muted-foreground">Rate / Kurs (IDR)</Label>
                                        <Input
                                            type="text"
                                            className="h-14 text-2xl font-bold text-center border-blue-200 focus:border-blue-500"
                                            value={formatNumber(customRate)}
                                            onChange={(e) => setCustomRate(e.target.value.replace(/\./g, ''))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">
                                    Total Estimasi (IDR)
                                </p>
                                <div className="text-6xl md:text-7xl font-black text-green-600 dark:text-green-400 tracking-tight break-all">
                                    {formatIDR(total).replace('Rp', '')}
                                    <span className="text-2xl font-bold text-muted-foreground ml-2">IDR</span>
                                </div>
                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-between border-t p-6 bg-gray-50/50 dark:bg-zinc-900/50">
                            <Button type="button" variant="ghost" size="lg" onClick={handleReset} className="text-muted-foreground">
                                Reset Form
                            </Button>
                            <Button type="submit" size="lg" className="w-48 text-lg font-semibold shadow-lg shadow-blue-500/20" disabled={!amount || !data.customer_name}>
                                <Save className="mr-2 h-5 w-5" />
                                SIMPAN
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                <div className="w-full">

                    <div className="flex items-center gap-2 mb-4">
                        <Printer className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preview Nota Fisik</h3>
                    </div>
                    <div className="w-full bg-white text-black font-mono text-sm border-2 border-dashed border-gray-400 p-1 shadow-sm overflow-x-auto">
                        <div className="min-w-[800px] border border-black flex">
                            <div className="w-1/4 border-r border-black p-4 flex flex-col justify-between">
                                <div>
                                    <div className="mb-6">
                                        <p className="font-bold mb-1">Payment :</p>
                                        <p className="text-lg uppercase">{data.payment_method}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold mb-1">Amount :</p>
                                        <p className="text-xl font-bold">{formatIDR(total)}</p>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-8">
                                    <div>
                                        <div className="h-0.5 w-24 bg-black mb-1"></div>
                                        <p className="text-xs">Authorized</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="h-0.5 w-20 bg-black mb-1"></div>
                                            <p className="text-xs">Kasir</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="h-0.5 w-20 bg-black mb-1"></div>
                                            <p className="text-xs">Nasabah</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-3/4 p-0">
                                <div className="flex border-b border-black p-4 items-center">
                                    <div className="text-4xl font-black mr-4 text-blue-800">$</div>
                                    <div>
                                        <h1 className="font-bold text-xl uppercase">PT. MONEY CHANGER SEJAHTERA</h1>
                                        <p className="text-xs">Penukaran Valuta Asing</p>
                                        <p className="text-xs">Jl. Jendral Sudirman No. 88, Jakarta Pusat</p>
                                        <p className="text-xs">Telp: 021-555-9999</p>
                                    </div>
                                </div>
                                <div className="flex border-b border-black text-center font-bold bg-gray-100">
                                    <div className="w-1/4 py-2 border-r border-black">Mata Uang</div>
                                    <div className="w-1/4 py-2 border-r border-black">Jumlah</div>
                                    <div className="w-1/4 py-2 border-r border-black">Kurs</div>
                                    <div className="w-1/4 py-2">Jumlah Total</div>
                                </div>
                                <div className="flex text-center h-32">
                                    <div className="w-1/4 py-4 border-r border-black font-bold text-lg">
                                        {selectedCurrency.code}
                                    </div>
                                    <div className="w-1/4 py-4 border-r border-black">
                                        {Number(amount).toLocaleString('id-ID')}
                                    </div>
                                    <div className="w-1/4 py-4 border-r border-black">
                                        {Number(customRate).toLocaleString('id-ID')}
                                    </div>
                                    <div className="w-1/4 py-4 font-bold">
                                        {formatIDR(total)}
                                    </div>
                                </div>
                                <div className="flex border-t border-black">
                                    <div className="w-1/2 p-2 border-r border-black">
                                        <p className="text-xs font-bold">JUAL KE / SOLD TO :</p>
                                        <p className="mt-1 font-medium uppercase">{data.customer_name || '.........................'}</p>
                                    </div>
                                    <div className="w-1/2 flex">
                                        <div className="w-1/2 p-2 border-r border-black">
                                            <p className="text-xs font-bold">NO :</p>
                                            <p className="mt-1">TRX-{new Date().getTime().toString().slice(-6)}</p>
                                        </div>
                                        <div className="w-1/2 p-2">
                                            <p className="text-xs font-bold">DATE :</p>
                                            <p className="mt-1">{new Date().toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="secondary" className="w-48" disabled>
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Nota
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}