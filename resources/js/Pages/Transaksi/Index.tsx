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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { router } from '@inertiajs/react';

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

import NotaTemplate1 from '../../Components/nota/NotaTemplate1';
import NotaTemplate2 from '../../Components/nota/NotaTemplate2';
import NotaTemplate4 from '../../Components/nota/NotaTemplate4';

import NotaTemplate3 from '@/Components/nota/NotaTemplate3';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { Currency } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Printer, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InvoiceTemplate from '@/Components/InvoiceTemplate';

interface Props {
    currencies: Currency[];
}

type EditorItem = {
    id: string;
    type: 'text';
    content: string;
    x: number;
    y: number;
    fontSize: number;
    bold?: boolean;
};

type TemplateId = 1 | 2 | 3 | 4;

const TEMPLATE_ITEMS: Record<TemplateId, EditorItem[]> = {
    1: [
        {
            id: 'title',
            type: 'text',
            content: 'NOTA TRANSAKSI',
            x: 0,
            y: 0,
            fontSize: 18,
            bold: true,
        },
        {
            id: 'customer',
            type: 'text',
            content: 'Nama: {{customer}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'currency',
            type: 'text',
            content: 'Valuta: {{currency}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'amount',
            type: 'text',
            content: 'Jumlah: {{amount}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'rate',
            type: 'text',
            content: 'Rate: {{rate}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'total',
            type: 'text',
            content: 'Total: {{total}}',
            x: 0,
            y: 0,
            fontSize: 14,
            bold: true,
        },
        {
            id: 'amount_left',
            type: 'text',
            content: 'Total: {{total}}',
            x: 0,
            y: 0,
            fontSize: 14,
            bold: true,
        },
    ],

    2: [
        {
            id: 'title',
            type: 'text',
            content: 'NOTA TRANSAKSI',
            x: 0,
            y: 0,
            fontSize: 18,
            bold: true,
        },
        {
            id: 'customer',
            type: 'text',
            content: 'Nama: {{customer}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'currency',
            type: 'text',
            content: 'Valuta: {{currency}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'amount',
            type: 'text',
            content: 'Jumlah: {{amount}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'rate',
            type: 'text',
            content: 'Rate: {{rate}}',
            x: 0,
            y: 0,
            fontSize: 12,
        },
        {
            id: 'total',
            type: 'text',
            content: 'Total: {{total}}',
            x: 0,
            y: 0,
            fontSize: 14,
            bold: true,
        },
        {
            id: 'amount_left',
            type: 'text',
            content: 'Total: {{total}}',
            x: 0,
            y: 0,
            fontSize: 14,
            bold: true,
        },
    ],

    3: [
        {
            id: 'title',
            type: 'text',
            content: 'BUKTI TRANSAKSI',
            x: 95,
            y: 20,
            fontSize: 17,
            bold: true,
        },
        {
            id: 'customer',
            type: 'text',
            content: 'Nasabah: {{customer}}',
            x: 20,
            y: 75,
            fontSize: 12,
        },
        {
            id: 'currency',
            type: 'text',
            content: 'Mata Uang: {{currency}}',
            x: 20,
            y: 100,
            fontSize: 12,
        },
        {
            id: 'amount',
            type: 'text',
            content: 'Jumlah: {{amount}}',
            x: 20,
            y: 125,
            fontSize: 12,
        },
        {
            id: 'rate',
            type: 'text',
            content: 'Kurs: {{rate}}',
            x: 20,
            y: 150,
            fontSize: 12,
        },
        {
            id: 'total',
            type: 'text',
            content: 'Total Bayar: {{total}}',
            x: 20,
            y: 190,
            fontSize: 14,
            bold: true,
        },
    ],

    4: [
        {
            id: 'title',
            type: 'text',
            content: 'NOTA PEMBAYARAN',
            x: 90,
            y: 20,
            fontSize: 17,
            bold: true,
        },
        {
            id: 'customer',
            type: 'text',
            content: 'Nama Pelanggan: {{customer}}',
            x: 20,
            y: 75,
            fontSize: 12,
        },
        {
            id: 'currency',
            type: 'text',
            content: 'Valas: {{currency}}',
            x: 20,
            y: 100,
            fontSize: 12,
        },
        {
            id: 'amount',
            type: 'text',
            content: 'Nominal: {{amount}}',
            x: 20,
            y: 125,
            fontSize: 12,
        },
        {
            id: 'rate',
            type: 'text',
            content: 'Rate IDR: {{rate}}',
            x: 20,
            y: 150,
            fontSize: 12,
        },
        {
            id: 'total',
            type: 'text',
            content: 'TOTAL IDR: {{total}}',
            x: 20,
            y: 195,
            fontSize: 15,
            bold: true,
        },
    ],
};

const initialItems = [
    {
        id: 'currency',
        type: 'text' as const,
        content: '{{currency}}',
        x: 20,
        y: 10,
        fontSize: 16,
        bold: true,
    },
    {
        id: 'amount',
        type: 'text' as const,
        content: '{{amount}}',
        x: 20,
        y: 40,
        fontSize: 14,
    },
    {
        id: 'customer',
        type: 'text' as const,
        content: '{{customer}}',
        x: 20,
        y: 90,
        fontSize: 14,
    },
];

export default function Transaksi({ currencies }: Props) {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        currencies[0] ?? null,
    );

    const [template, setTemplate] = useState<1 | 2 | 3 | 4>(1);

    const [templateLayouts, setTemplateLayouts] =
        useState<Record<TemplateId, EditorItem[]>>(TEMPLATE_ITEMS);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');
    const [searchCurrency, setSearchCurrency] = useState('');
    const [localCurrencies, setLocalCurrencies] =
        useState<Currency[]>(currencies);

    const [amount, setAmount] = useState<number | string>('');
    const [customRate, setCustomRate] = useState<number | string>('');
    const [total, setTotal] = useState<number>(0);

    const [editorItems, setEditorItems] = useState<EditorItem[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);

    //     const [items, setItems] = useState<EditorItem[]>(initialItems);

    // const handleDrag = (id: string, dx: number, dy: number) => {
    //     setItems((prev) =>
    //         prev.map((item) =>
    //             item.id === id
    //                 ? {
    //                       ...item,
    //                       x: item.x + dx,
    //                       y: item.y + dy,
    //                   }
    //                 : item,
    //         ),
    //     );
    // };

    useEffect(() => {
        if (!isEditMode) return;

        setEditorItems(templateLayouts[template].map((item) => ({ ...item })));
    }, [isEditMode, template, templateLayouts]);

    const { data, setData, reset } = useForm({
        customer_name: '',
        currency_id: currencies[0]?.id,
        type: 'buy',
        amount: '',
        rate: '',
        total_idr: '',
        payment_method: 'cash',
        template_id: 1,
    });

    useEffect(() => {
        setData('template_id', template);
    }, [template]);

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
            template_id: template,
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
                    Accept: 'application/json',
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
                                        value={String(template)}
                                        onValueChange={(v) => {
                                            const selected = Number(v) as
                                                | 1
                                                | 2
                                                | 3
                                                | 4;
                                            setTemplate(selected);
                                            setData('template_id', selected);
                                        }}
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
                    <div className="mb-4">
                        <Label className="mb-2 block">
                            Pilih Template Nota
                        </Label>
                        <Tabs
                            value={String(template)}
                            onValueChange={(v) =>
                                setTemplate(Number(v) as 1 | 2 | 3 | 4)
                            }
                        >
                            <TabsList>
                                <TabsTrigger value="1">Template 1</TabsTrigger>
                                <TabsTrigger value="2">Template 2</TabsTrigger>
                                <TabsTrigger value="3">Template 3</TabsTrigger>
                                <TabsTrigger value="4">Template 4</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="mb-6 flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditMode(true)}
                        >
                            Edit Template
                        </Button>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <Printer className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Preview Nota Fisik
                        </h3>
                    </div>

                    <InvoiceTemplate
                        transaction={{
                            id: 0,
                            invoice_number: '-',
                            template_id: template,
                            currency: selectedCurrency,
                            amount:
                                Number(
                                    String(amount)
                                        .replace(/\./g, '')
                                        .replace(',', '.'),
                                ) || 0,
                            rate:
                                Number(
                                    String(customRate)
                                        .replace(/\./g, '')
                                        .replace(',', '.'),
                                ) || 0,
                            total_idr: total,
                            customer_name: data.customer_name || '-',
                            payment_method: data.payment_method || 'cash',
                            created_at: new Date().toISOString(),
                            type: mode,
                            user: { name: '-' },
                            financial_account: {
                                type: data.payment_method || 'cash',
                            },
                        }}
                        templateId={template}
                        items={templateLayouts[template]}
                    />

                    <div className="mt-4 flex justify-end">
                        <Button variant="secondary" className="w-48" disabled>
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Nota
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Template Nota</DialogTitle>
                    </DialogHeader>

                    <div className="relative h-[500px] w-full overflow-visible border bg-white">
                        {template === 1 && (
                            <NotaTemplate1
                                data={data}
                                selectedCurrency={selectedCurrency}
                                amount={amount}
                                customRate={customRate}
                                total={total}
                                formatIDR={formatIDR}
                                formatNumber={formatNumber}
                                items={editorItems}
                                onDrag={(id, dx, dy) => {
                                    setEditorItems((prev) =>
                                        prev.map((item) => {
                                            if (item.id !== id) return item;

                                            const newX = item.x + dx;
                                            const newY = item.y + dy;

                                            return {
                                                ...item,
                                                x: Math.max(
                                                    0,
                                                    Math.min(newX, 900),
                                                ), // batas kanan
                                                y: Math.max(
                                                    0,
                                                    Math.min(newY, 450),
                                                ), // batas bawah
                                            };
                                        }),
                                    );
                                }}
                            />
                        )}

                        {template === 2 && (
                            <NotaTemplate2
                                data={data}
                                selectedCurrency={selectedCurrency}
                                amount={amount}
                                customRate={customRate}
                                total={total}
                                formatIDR={formatIDR}
                                formatNumber={formatNumber}
                                items={editorItems}
                                onDrag={(id, dx, dy) => {
                                    setEditorItems((prev) =>
                                        prev.map((item) => {
                                            if (item.id !== id) return item;

                                            const newX = item.x + dx;
                                            const newY = item.y + dy;

                                            return {
                                                ...item,
                                                x: Math.max(
                                                    0,
                                                    Math.min(newX, 900),
                                                ), // batas kanan
                                                y: Math.max(
                                                    0,
                                                    Math.min(newY, 450),
                                                ), // batas bawah
                                            };
                                        }),
                                    );
                                }}
                            />
                        )}

                        {template === 3 && (
                            <NotaTemplate3
                                data={data}
                                selectedCurrency={selectedCurrency}
                                amount={amount}
                                customRate={customRate}
                                total={total}
                                formatIDR={formatIDR}
                                formatNumber={formatNumber}
                                items={editorItems}
                                onDrag={(id, dx, dy) => {
                                    setEditorItems((prev) =>
                                        prev.map((item) => {
                                            if (item.id !== id) return item;

                                            const newX = item.x + dx;
                                            const newY = item.y + dy;

                                            return {
                                                ...item,
                                                x: Math.max(
                                                    0,
                                                    Math.min(newX, 900),
                                                ), // batas kanan
                                                y: Math.max(
                                                    0,
                                                    Math.min(newY, 450),
                                                ), // batas bawah
                                            };
                                        }),
                                    );
                                }}
                            />
                        )}

                        {template === 4 && (
                            <NotaTemplate4
                                data={data}
                                selectedCurrency={selectedCurrency}
                                amount={amount}
                                customRate={customRate}
                                total={total}
                                formatIDR={formatIDR}
                                formatNumber={formatNumber}
                                items={editorItems}
                                onDrag={(id, dx, dy) => {
                                    setEditorItems((prev) =>
                                        prev.map((item) => {
                                            if (item.id !== id) return item;

                                            const newX = item.x + dx;
                                            const newY = item.y + dy;

                                            return {
                                                ...item,
                                                x: Math.max(
                                                    0,
                                                    Math.min(newX, 900),
                                                ), // batas kanan
                                                y: Math.max(
                                                    0,
                                                    Math.min(newY, 450),
                                                ), // batas bawah
                                            };
                                        }),
                                    );
                                }}
                            />
                        )}
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                router.post(
                                    '/nota-layout/save',
                                    {
                                        template_id: template,
                                        layout: editorItems,
                                    },
                                    {
                                        preserveScroll: true,
                                        onStart: () => {
                                            toast.loading(
                                                'Menyimpan layout...',
                                                { id: 'save-layout' },
                                            );
                                        },
                                        onSuccess: () => {
                                            toast.success(
                                                'Layout berhasil disimpan!',
                                                { id: 'save-layout' },
                                            );

                                            setTemplateLayouts((prev) => ({
                                                ...prev,
                                                [template]: editorItems,
                                            }));

                                            setIsEditMode(false);
                                        },
                                        onError: (errors) => {
                                            console.log(
                                                'SAVE LAYOUT ERROR:',
                                                errors,
                                            );

                                            toast.error('Gagal simpan layout', {
                                                id: 'save-layout',
                                                description:
                                                    (errors as any)
                                                        ?.template_id ||
                                                    (errors as any)?.layout ||
                                                    'Cek console untuk detail error',
                                            });
                                        },
                                        onFinish: () => {
                                            toast.dismiss('save-layout');
                                        },
                                    },
                                );
                            }}
                        >
                            Simpan Layout
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
