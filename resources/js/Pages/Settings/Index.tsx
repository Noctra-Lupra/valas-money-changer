import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
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
    AlertTriangle
} from 'lucide-react';
import { PageProps, User, FinancialAccount } from '@/types';
import CreateUserForm from './Partials/CreateUserForm';
import ResetPasswordForm from './Partials/ResetPasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { toast } from 'sonner';


// DUMMY DATA VALAS
const currencies = [
    { id: 1, code: 'USD', name: 'Dollar Amerika', stock: 1500, avg_rate: 15100 },
    { id: 2, code: 'SGD', name: 'Dollar Singapura', stock: 4000, avg_rate: 11550 },
];

export default function SettingIndex({ auth, users = [], financialAccounts = [] }: PageProps<{ users: User[], financialAccounts: FinancialAccount[] }>) {
    const [activeTab, setActiveTab] = useState('financial');

    // FINANCIAL FORM
    const { data: financialData, setData: setFinancialData, put: putFinancial, processing: processingFinancial } = useForm({
        accounts: financialAccounts.length > 0 ? financialAccounts.map(acc => ({
            type: acc.type,
            balance: Number(acc.balance),
            account_name: acc.account_name,
            account_number: acc.account_number
        })) : []
    });

    const handleFinancialChange = (index: number, val: string) => {
        const newAccounts = [...financialData.accounts];
        const clean = val.replace(/[^0-9]/g, '');
        newAccounts[index].balance = Number(clean);
        setFinancialData('accounts', newAccounts);
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

    const [resetUser, setResetUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const formatNumber = (val: number | string) => {
        if (!val) return '';
        return new Intl.NumberFormat('id-ID').format(Number(String(val).replace(/[^0-9]/g, '')));
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
                                            return (
                                                <div key={acc.type} className="space-y-2">
                                                    <Label>{acc.account_name} {acc.account_number && `(${acc.account_number})`}</Label>
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
                                <div className="space-y-2">
                                    <Label>Pilih Mata Uang</Label>
                                    <Select onValueChange={(val) => {
                                        const curr = currencies.find(c => c.code === val);
                                        setSelectedValas(val);
                                        if (curr) {
                                            setEditStock(String(curr.stock));
                                            setEditRate(String(curr.avg_rate));
                                        }
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Valas..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map(c => (
                                                <SelectItem key={c.id} value={c.code}>{c.code} - {c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                <Button variant="destructive" disabled={!selectedValas}>
                                    Simpan Koreksi (Log Audit)
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