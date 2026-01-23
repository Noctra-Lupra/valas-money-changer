import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/Components/ui/command';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { Currency } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Printer, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    currencies: Currency[];
}

export default function Transaksi({ currencies }: Props) {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        currencies[0] ?? null,
    );

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');
    const [searchCurrency, setSearchCurrency] = useState('');
    const [localCurrencies, setLocalCurrencies] =
        useState<Currency[]>(currencies);

    const [amount, setAmount] = useState<number | string>('');
    const [customRate, setCustomRate] = useState<number | string>('');
    const [total, setTotal] = useState<number>(0);

    const { data, setData, reset } = useForm({
        customer_name: '',
        currency_id: currencies[0]?.id,
        type: 'buy',
        amount: '',
        rate: '',
        total_idr: '',
        payment_method: 'cash',
    });

    useEffect(() => {
        setCustomRate('');
    }, [selectedCurrency, mode]);

    useEffect(() => {
        if (!selectedCurrency) return;
        
        const parseValue = (val: number | string) => {
            if (!val) return 0;
            const cleanStr = String(val).replace(/\./g, '').replace(',', '.');
            return Number(cleanStr) || 0;
        };

        const numAmount = parseValue(amount);
        const numRate = parseValue(customRate);
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
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    const formatNumber = (val: number | string) => {
        if (!val && val !== 0) return '';
        const strVal = String(val);
        const parts = strVal.split(',');

        // Format integer part
        const integerPart = parts[0].replace(/[^0-9]/g, '');
        const formattedInteger = new Intl.NumberFormat('id-ID').format(
            Number(integerPart) || 0,
        );

        if (parts.length > 1) {
            // Include decimal part
            const decimalPart = parts[1].replace(/[^0-9]/g, '');
            return `${formattedInteger},${decimalPart}`;
        }

        if (strVal.endsWith(',')) {
            return `${formattedInteger},`;
        }

        return formattedInteger;
    };

    const handleReset = () => {
        reset();
        setAmount('');
        setCustomRate('');
        setTotal(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            amount: Number(data.amount),
            rate: Number(data.rate),
            total_idr: Number(data.total_idr),
        };

        import('@inertiajs/react').then(({ router }) => {
            router.post('/transaksi', payload, {
                onSuccess: () => {
                    toast.success('Transaksi Berhasil!');
                    reset();
                    setAmount('');
                    setCustomRate('');
                    setTotal(0);
                },
                onError: (errors) => {
                    console.log('Errors:', errors);
                    if (errors.total_idr) {
                        toast.error('Transaksi Gagal', {
                            description: errors.total_idr,
                        });
                    } else if (errors.amount) {
                        toast.error('Transaksi Gagal', {
                            description: errors.amount,
                        });
                    } else if (errors.payment_method) {
                        toast.error('Transaksi Gagal', {
                            description: errors.payment_method,
                        });
                    } else {
                        toast.error('Terjadi Kesalahan', {
                            description: 'Silakan cek kembali inputan anda.',
                        });
                    }
                },
            });
        });
    };

   const handleQuickAddCurrency = async () => {
    try {
        const res = await fetch('/currencies/quick', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json', 
                'X-CSRF-TOKEN': (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                ).content,
            },
            body: JSON.stringify({
                code: searchCurrency.trim().toUpperCase(),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Gagal');
        }

        setLocalCurrencies((prev) => [...prev, data]);
        setSelectedCurrency(data);
        setData('currency_id', data.id);
        setSearchCurrency('');
        setOpen(false);

        toast.success(`Mata uang ${data.code} ditambahkan`);
    } catch (err: any) {
        toast.error('Gagal menambahkan mata uang', {
            description: err.message,
        });
    }
};


    if (!selectedCurrency) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Kasir Transaksi
                    </h2>
                }
            >
                <Head title="Transaksi Baru" />
                <div className="p-6 text-center text-muted-foreground">
                    Tidak ada data mata uang.
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Kasir Transaksi
                </h2>
            }
        >
            <Head title="Transaksi Baru" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
                <form onSubmit={handleSubmit}>
                    <Card className="border-t-4 border-t-blue-600 shadow-md">
                        <CardHeader>
                            <CardTitle>Input Data Transaksi</CardTitle>
                            <CardDescription>
                                Masukkan detail transaksi valuta asing.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                                <div className="md:col-span-4">
                                    <Label className="mb-2 block">
                                        Jenis Transaksi
                                    </Label>
                                    <Tabs
                                        defaultValue="buy"
                                        onValueChange={(val) =>
                                            setMode(val as 'buy' | 'sell')
                                        }
                                        className="w-full"
                                    >
                                        <TabsList className="grid h-11 w-full grid-cols-2">
                                            <TabsTrigger
                                                value="buy"
                                                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                                            >
                                                BELI
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="sell"
                                                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                                            >
                                                JUAL
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                <div className="space-y-2 md:col-span-5">
                                    <Label htmlFor="customer">
                                        Nama Nasabah
                                    </Label>
                                    <Input
                                        id="customer"
                                        placeholder="Nama Lengkap..."
                                        value={data.customer_name}
                                        onChange={(e) =>
                                            setData(
                                                'customer_name',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-3">
                                    <Label>Pembayaran</Label>
                                    <Select
                                        onValueChange={(val) =>
                                            setData('payment_method', val)
                                        }
                                        defaultValue={data.payment_method}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">
                                                💵 CASH
                                            </SelectItem>
                                            <SelectItem value="bca">
                                                🏦 BCA
                                            </SelectItem>
                                            <SelectItem value="mandiri">
                                                🏦 MANDIRI
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator className="my-2" />

                            <div className="grid grid-cols-1 items-end gap-4 rounded-xl border border-gray-100 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-12">
                                <div className="space-y-2 md:col-span-3">
                                    <Label className="text-muted-foreground">
                                        Mata Uang
                                    </Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="h-14 w-full justify-between text-xl font-bold"
                                            >
                                                {selectedCurrency.code.toUpperCase()}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-[200px] p-0"
                                            side="bottom"
                                            align="start"
                                            avoidCollisions={false}
                                        >
                                            <Command>
                                                <CommandInput
                                                    placeholder="Cari valas..."
                                                    className="h-9"
                                                    value={searchCurrency}
                                                    onValueChange={
                                                        setSearchCurrency
                                                    }
                                                />

                                                <CommandList>
                                                    <CommandEmpty>
                                                        Valas tidak ditemukan.
                                                    </CommandEmpty>

                                                    <CommandGroup>
                                                        {localCurrencies.map(
                                                            (curr) => (
                                                                <CommandItem
                                                                    key={
                                                                        curr.id
                                                                    }
                                                                    value={
                                                                        curr.code
                                                                    }
                                                                    className="uppercase"
                                                                    onSelect={() => {
                                                                        setSelectedCurrency(
                                                                            curr,
                                                                        );
                                                                        setOpen(
                                                                            false,
                                                                        );
                                                                        setSearchCurrency(
                                                                            '',
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            selectedCurrency.id ===
                                                                                curr.id
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {curr.code}
                                                                </CommandItem>
                                                            ),
                                                        )}

                                                        {searchCurrency &&
                                                            !localCurrencies.some(
                                                                (c) =>
                                                                    c.code.toLowerCase() ===
                                                                    searchCurrency.toLowerCase(),
                                                            ) && (
                                                                <CommandItem
                                                                    className="font-semibold text-blue-600"
                                                                    onSelect={
                                                                        handleQuickAddCurrency
                                                                    }
                                                                >
                                                                    Simpan mata
                                                                    uang "
                                                                    {searchCurrency.toUpperCase()}
                                                                    "
                                                                </CommandItem>
                                                            )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex items-end gap-3 md:col-span-9">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-muted-foreground">
                                            Jumlah (
                                            {selectedCurrency.code.toUpperCase()}
                                            )
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="0"
                                            className="h-14 text-center text-2xl font-bold"
                                            value={formatNumber(amount)}
                                            onChange={(e) =>
                                                setAmount(
                                                    e.target.value.replace(
                                                        /\./g,
                                                        '',
                                                    ),
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="flex h-14 items-center justify-center px-1">
                                        <div className="rounded-full bg-gray-200 p-1.5 dark:bg-gray-700">
                                            <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <Label className="text-muted-foreground">
                                            Rate / Kurs (IDR)
                                        </Label>
                                        <Input
                                            type="text"
                                            className="h-14 border-blue-200 text-center text-2xl font-bold focus:border-blue-500"
                                            value={formatNumber(customRate)}
                                            onChange={(e) =>
                                                setCustomRate(
                                                    e.target.value.replace(
                                                        /\./g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                                    Total Estimasi (IDR)
                                </p>
                                <div className="break-all text-6xl font-black tracking-tight text-green-600 dark:text-green-400 md:text-7xl">
                                    {formatIDR(total).replace('Rp', '')}
                                    <span className="ml-2 text-2xl font-bold text-muted-foreground">
                                        IDR
                                    </span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6 dark:bg-zinc-900/50">
                            <Button
                                type="button"
                                variant="ghost"
                                size="lg"
                                onClick={handleReset}
                                className="text-muted-foreground"
                            >
                                Reset Form
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-48 text-lg font-semibold shadow-lg shadow-blue-500/20"
                                disabled={!amount || !data.customer_name}
                            >
                                <Save className="mr-2 h-5 w-5" />
                                SIMPAN
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                <div className="w-full">
                    <div className="mb-4 flex items-center gap-2">
                        <Printer className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Preview Nota Fisik
                        </h3>
                    </div>
                    <div className="w-full overflow-x-auto border-2 border-dashed border-gray-400 bg-white p-1 font-mono text-sm text-black shadow-sm">
                        <div className="flex min-w-[800px] border border-black">
                            <div className="flex w-1/4 flex-col justify-between border-r border-black p-4">
                                <div>
                                    <div className="mb-6">
                                        <p className="mb-1 font-bold">
                                            Payment :
                                        </p>
                                        <p className="text-lg uppercase">
                                            {data.payment_method}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 font-bold">
                                            Amount :
                                        </p>
                                        <p className="text-xl font-bold">
                                            {formatIDR(total)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-8">
                                    <div>
                                        <div className="mb-1 h-0.5 w-24 bg-black"></div>
                                        <p className="text-xs">Authorized</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="mb-1 h-0.5 w-20 bg-black"></div>
                                            <p className="text-xs">Kasir</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="mb-1 h-0.5 w-20 bg-black"></div>
                                            <p className="text-xs">Nasabah</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-3/4 p-0">
                                <div className="flex items-center border-b border-black p-4">
                                    <div className="mr-4 text-4xl font-black text-blue-800">
                                        $
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold uppercase">
                                            PT. MONEY CHANGER SEJAHTERA
                                        </h1>
                                        <p className="text-xs">
                                            Penukaran Valuta Asing
                                        </p>
                                        <p className="text-xs">
                                            Jl. Jendral Sudirman No. 88, Jakarta
                                            Pusat
                                        </p>
                                        <p className="text-xs">
                                            Telp: 021-555-9999
                                        </p>
                                    </div>
                                </div>
                                <div className="flex border-b border-black bg-gray-100 text-center font-bold">
                                    <div className="w-1/4 border-r border-black py-2">
                                        Mata Uang
                                    </div>
                                    <div className="w-1/4 border-r border-black py-2">
                                        Jumlah
                                    </div>
                                    <div className="w-1/4 border-r border-black py-2">
                                        Kurs
                                    </div>
                                    <div className="w-1/4 py-2">
                                        Jumlah Total
                                    </div>
                                </div>
                                <div className="flex h-32 text-center">
                                    <div className="w-1/4 border-r border-black py-4 text-lg font-bold">
                                        {selectedCurrency.code}
                                    </div>
                                    <div className="w-1/4 border-r border-black py-4">
                                        {formatNumber(amount)}
                                    </div>
                                    <div className="w-1/4 border-r border-black py-4">
                                        {formatNumber(customRate)}
                                    </div>
                                    <div className="w-1/4 py-4 font-bold">
                                        {formatIDR(total)}
                                    </div>
                                </div>
                                <div className="flex border-t border-black">
                                    <div className="w-1/2 border-r border-black p-2">
                                        <p className="text-xs font-bold">
                                            JUAL KE / SOLD TO :
                                        </p>
                                        <p className="mt-1 font-medium uppercase">
                                            {data.customer_name ||
                                                '.........................'}
                                        </p>
                                    </div>
                                    <div className="flex w-1/2">
                                        <div className="w-1/2 border-r border-black p-2">
                                            <p className="text-xs font-bold">
                                                NO :
                                            </p>
                                            <p className="mt-1">
                                                TRX-
                                                {new Date()
                                                    .getTime()
                                                    .toString()
                                                    .slice(-6)}
                                            </p>
                                        </div>
                                        <div className="w-1/2 p-2">
                                            <p className="text-xs font-bold">
                                                DATE :
                                            </p>
                                            <p className="mt-1">
                                                {new Date().toLocaleDateString(
                                                    'id-ID',
                                                )}
                                            </p>
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
