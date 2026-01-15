import { useRef, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import InputError from '@/Components/InputError';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateUserForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        role: 'staff',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                reset();
                toast.success('User berhasil ditambahkan');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal menambahkan user');
            }
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> User Baru</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Buat User Baru</DialogTitle>
                        <DialogDescription>Silahkan buat user baru disini.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Silahkan isi nama lengkap"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>Username (untuk Login)</Label>
                            <Input
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                placeholder="Silahkan isi username"
                                required
                            />
                            <InputError message={errors.username} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={val => setData('role', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Silahkan isi password"
                                required
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="Silahkan confirm password"
                                required
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Simpan User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
