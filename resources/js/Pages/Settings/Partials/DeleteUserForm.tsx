import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { toast } from 'sonner';
import { User } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface Props {
    user: User | null;
    onClose: () => void;
}

export default function DeleteUserForm({ user, onClose }: Props) {
    const { delete: destroy, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!user) return;

        destroy(route('users.destroy', user.id), {
            onSuccess: () => {
                onClose();
                toast.success('User berhasil dihapus');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal menghapus user');
                onClose();
            }
        });
    };

    return (
        <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" /> Hapus User
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus user <b>{user?.name}</b>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            User yang dihapus tidak akan bisa login kembali ke sistem.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Ya, Hapus User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
