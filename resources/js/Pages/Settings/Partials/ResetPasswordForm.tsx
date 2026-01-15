import { FormEventHandler } from 'react';
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
} from "@/Components/ui/dialog"
import InputError from '@/Components/InputError';
import { toast } from 'sonner';
import { User } from '@/types';

interface Props {
    user: User | null;
    onClose: () => void;
}

export default function ResetPasswordForm({ user, onClose }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!user) return;

        put(route('users.update-password', user.id), {
            onSuccess: () => {
                onClose();
                reset();
                toast.success('Password berhasil direset');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal mereset password');
            }
        });
    };

    return (
        <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Reset Password User</DialogTitle>
                        <DialogDescription>
                            Ubah password untuk user <b>{user?.name}</b> ({user?.username}).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input value={user?.username || ''} disabled readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Password Baru</Label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Isi password baru"
                                required
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Password Baru</Label>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="Konfirmasi password baru"
                                required
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Simpan Password Baru
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
