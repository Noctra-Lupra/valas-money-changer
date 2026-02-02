import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Wallet,
    Coins,
    FileText,
    Users,
    KeyRound,
    Trash2,
    AlertTriangle,
    Check,
    ChevronsUpDown
} from 'lucide-react';
import { PageProps, User, FinancialAccount, Currency } from '@/types';
import CreateUserForm from './Partials/CreateUserForm';
import ResetPasswordForm from './Partials/ResetPasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"

export default function SettingIndex({ auth, users = [], financialAccounts = [], currencies = [], openingBalances, yesterdayGrandTotal = 0, yesterdayTotalMoneyBalance = 0 }: PageProps<{ users: User[], financialAccounts: FinancialAccount[], currencies: Currency[], openingBalances?: { cash: number, bca: number, mandiri: number } | null, yesterdayGrandTotal?: number, yesterdayTotalMoneyBalance?: number }>) {
    const [activeTab, setActiveTab] = useState('financial');

    const { data: financialData, setData: setFinancialData, put: putFinancial, processing: processingFinancial } = useForm({
        accounts: financialAccounts.length > 0 ? financialAccounts.map(acc => {
            let initialBalance = Number(acc.balance);
            if (openingBalances) {
                const type = acc.type.toLowerCase();
                if (type === 'cash' && openingBalances.cash !== undefined) {
                    initialBalance = Number(openingBalances.cash);
                } else if (type === 'bca' && openingBalances.bca !== undefined) {
                    initialBalance = Number(openingBalances.bca);
                } else if (type === 'mandiri' && openingBalances.mandiri !== undefined) {
                    initialBalance = Number(openingBalances.mandiri);
                }
            }

            return {
                type: acc.type,
                balance: initialBalance,
                account_name: acc.account_name,
                account_number: acc.account_number
            };
        }) : [],
        grand_total: yesterdayGrandTotal,
        total_money_balance: yesterdayTotalMoneyBalance
    });

    const handleFinancialChange = (index: number, val: string) => {
        const newAccounts = [...financialData.accounts];
        const clean = val.replace(/[^0-9]/g, '');
        newAccounts[index].balance = Number(clean);
        setFinancialData('accounts', newAccounts);
    };

    const handleGrandTotalChange = (val: string) => {
        const clean = val.replace(/[^0-9]/g, '');
        setFinancialData('grand_total', Number(clean));
    };

    const submitFinancial = () => {
        putFinancial(route('financial.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Saldo berhasil diperbarui');
            },
            onError: () => {
                toast.error('Gagal memperbarui saldo');
            }
        });
    };

    const [selectedValas, setSelectedValas] = useState<string>('');
    const [editStock, setEditStock] = useState<string>('');
    const [editRate, setEditRate] = useState<string>('');
    const [openCombobox, setOpenCombobox] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleCorrectionSubmit = () => {
        if (!selectedValas) return;
        setIsSaving(true);

        const parseValue = (val: string) => {
            const cleanStr = val.replace(/\./g, '').replace(',', '.');
            return Number(cleanStr) || 0;
        };

        router.put(route('currencies.update-stock'), {
            code: selectedValas,
            stock_amount: parseValue(editStock),
            average_rate: parseValue(editRate),
        }, {
            onSuccess: () => {
                toast.success('Stok berhasil dikoreksi.');
                setIsSaving(false);
            },
            onError: () => {
                toast.error('Gagal mengoreksi stok.');
                setIsSaving(false);
            },
            preserveScroll: true
        });
    };

    const [resetUser, setResetUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);


    const formatNumber = (val: number | string) => {
        if (!val && val !== 0) return '';
        const strVal = String(val);
        const parts = strVal.split(',');

        // Format integer part
        const integerPart = parts[0].replace(/[^0-9]/g, '');
        const formattedInteger = new Intl.NumberFormat('id-ID').format(Number(integerPart) || 0);

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Pengaturan & Manajemen
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="flex flex-col md:flex-row gap-6 w-full px-4 py-6">
                <nav className="w-full md:w-64 flex flex-col gap-2">
                    <Button
                        variant={activeTab === 'financial' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('financial')}
                    >
                        <Wallet className="mr-2 h-4 w-4" /> Keuangan
                    </Button>
                    <Button
                        variant={activeTab === 'valas' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('valas')}
                    >
                        <Coins className="mr-2 h-4 w-4" /> Koreksi Stok Valas
                    </Button>
                    <Button
                        variant={activeTab === 'app' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('app')}
                    >
                        <FileText className="mr-2 h-4 w-4" /> Template Nota
                    </Button>
                    <Button
                        variant={activeTab === 'users' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('users')}
                    >
                        <Users className="mr-2 h-4 w-4" /> User Management
                    </Button>
                </nav>

                <div className="flex-1">
                    {activeTab === 'financial' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Saldo Awal & Kas Fisik</CardTitle>
                                    <CardDescription>Ubah saldo awal harian secara manual jika terjadi kesalahan input fatal.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {financialData.accounts.map((acc, index) => {
                                        if (acc.type !== 'cash') return null;
                                        return (
                                            <div key={acc.type} className="space-y-2">
                                                <Label>{acc.account_name}</Label>
                                                <Input
                                                    value={formatNumber(acc.balance)}
                                                    onChange={(e) => handleFinancialChange(index, e.target.value)}
                                                />
                                            </div>
                                        );
                                    })}
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 text-xs text-yellow-700 dark:text-yellow-400 flex gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Perhatian: Mengubah saldo awal akan mempengaruhi laporan profit hari ini.
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={submitFinancial} disabled={processingFinancial}>Update Saldo Awal</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Saldo Rekening Bank</CardTitle>
                                    <CardDescription>Penyesuaian saldo bank untuk pencatatan.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {financialData.accounts.map((acc, index) => {
                                            if (acc.type === 'cash') return null;
                                            // Hide bca2 and mandiri2 if requested
                                            if (acc.type === 'bca2' || acc.type === 'mandiri2' || acc.type === 'cash2') return null;

                                            return (
                                                <div key={acc.type} className="space-y-2">
                                                    <Label>{acc.account_name}</Label>
                                                    <Input
                                                        value={formatNumber(acc.balance)}
                                                        onChange={(e) => handleFinancialChange(index, e.target.value)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={submitFinancial} disabled={processingFinancial}>Update Saldo Bank</Button>
                                </CardFooter>
                            </Card>

                            <Card className="">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Total Saldo Akhir Uang</CardTitle>
                                            <CardDescription>Input manual untuk override Total Saldo Akhir tanpa mengubah rincian saldo.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        <Label>Total Saldo Akhir (Manual Override)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="text-lg font-bold"
                                                value={formatNumber(financialData.total_money_balance)}
                                                onChange={(e) => {
                                                    const clean = e.target.value.replace(/[^0-9]/g, '');
                                                    setFinancialData('total_money_balance', Number(clean));
                                                }}
                                            />
                                            <Button onClick={submitFinancial} disabled={processingFinancial}>
                                                Update Total Saldo Akhir
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Total Aset (Grand Total)</CardTitle>
                                            <CardDescription>Input manual untuk override Grand Total.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        <Label className="">Grand Total Awal (Manual Override)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="text-lg font-bold"
                                                value={formatNumber(financialData.grand_total)}
                                                onChange={(e) => handleGrandTotalChange(e.target.value)}
                                            />
                                            <Button onClick={submitFinancial} disabled={processingFinancial}>Update Grandtotal</Button>
                                        </div>
                                        {/* <p className="text-xs text-muted-foreground">
                                            Estimasi System: {formatNumber(
                                                financialData.accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0) +
                                                currencies.reduce((sum, curr) => sum + (Number(curr.stock_amount || 0) * Number(curr.average_rate || 0)), 0)
                                            )}
                                        </p> */}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {activeTab === 'valas' && (
                        <Card className="border-red-200 dark:border-red-900">
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Koreksi Stok & Modal (Manual)
                                </CardTitle>
                                <CardDescription>
                                    Fitur ini digunakan untuk <b>Stock Opname</b> atau memperbaiki kesalahan input modal.
                                    Perubahan di sini akan tercatat di Audit Log.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2 flex flex-col">
                                    <Label>Pilih Mata Uang</Label>
                                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCombobox}
                                                className="w-full justify-between py-5"
                                            >
                                                {selectedValas
                                                    ? `${currencies.find((c) => c.code === selectedValas)?.code.toUpperCase()}`
                                                    : "Pilih Valas..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            side="bottom"
                                            align="start"
                                            avoidCollisions={false}
                                            className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari valas..." />
                                                <CommandList>
                                                    <CommandEmpty>Valas tidak ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        {currencies.map((framework) => (
                                                            <CommandItem
                                                                key={framework.id}
                                                                value={framework.code}
                                                                onSelect={(currentValue) => {
                                                                    setSelectedValas(framework.code);
                                                                    setEditStock(String(Number(framework.stock_amount)).replace('.', ','));
                                                                    setEditRate(String(Number(framework.average_rate)).replace('.', ','));
                                                                    setOpenCombobox(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedValas === framework.code ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {framework.code.toUpperCase()}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Stok Fisik Baru (Lembar)</Label>
                                        <Input
                                            value={formatNumber(editStock)}
                                            onChange={(e) => setEditStock(e.target.value.replace(/\./g, ''))}
                                            disabled={!selectedValas}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rata-rata Modal Baru (IDR)</Label>
                                        <Input
                                            value={formatNumber(editRate)}
                                            onChange={(e) => setEditRate(e.target.value.replace(/\./g, ''))}
                                            disabled={!selectedValas}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" disabled={!selectedValas || isSaving} onClick={handleCorrectionSubmit}>
                                    {isSaving ? "Menyimpan..." : "Simpan Koreksi (Log Audit)"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                    {activeTab === 'app' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Template Nota</CardTitle>
                                <CardDescription>Atur informasi yang muncul pada struk transaksi.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Perusahaan (Header)</Label>
                                    <Input defaultValue="PT. MONEY CHANGER SEJAHTERA" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Alamat & Telp</Label>
                                    <Textarea defaultValue="Jl. Jendral Sudirman No. 88, Jakarta Pusat&#10;Telp: 021-555-9999" rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Catatan Kaki (Footer)</Label>
                                    <Textarea defaultValue="Terima kasih. Harap hitung kembali uang Anda sebelum meninggalkan kasir. Komplain setelah meninggalkan kasir tidak dilayani." rows={3} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Simpan Template</Button>
                            </CardFooter>
                        </Card>
                    )}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Manajemen User</CardTitle>
                                        <CardDescription>Kelola akun staff dan admin.</CardDescription>
                                    </div>
                                    <CreateUserForm />
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-medium">{user.name}</TableCell>
                                                        <TableCell>{user.username}</TableCell>
                                                        <TableCell className="capitalize badge">{user.role}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    title="Reset Password"
                                                                    onClick={() => setResetUser(user)}
                                                                >
                                                                    <KeyRound className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    title="Hapus User"
                                                                    onClick={() => setDeleteUser(user)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                                        Tidak ada data user.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <ResetPasswordForm
                                user={resetUser}
                                onClose={() => setResetUser(null)}
                            />

                            <DeleteUserForm
                                user={deleteUser}
                                onClose={() => setDeleteUser(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}