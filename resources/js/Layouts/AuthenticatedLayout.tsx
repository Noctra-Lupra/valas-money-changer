import {
    LayoutGrid,
    ListTodo,
    Menu,
    MessageSquare,
    Package,
    Users,
    ArrowLeftRight,
    Banknote,
    BookAlert,
    Settings,
    GalleryVerticalEnd,
    History
} from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';
import { Toaster } from "sonner";
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <>
            <Toaster richColors position="top-center" />
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block sticky top-0 h-screen">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-2 font-semibold"
                            >
                                <Package className="h-6 w-6" />
                                <span className="">Nama Perusahaan</span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-auto py-2">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                <div className="px-2 py-2">
                                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                                        General
                                    </h3>
                                    <div className="space-y-1">
                                        <NavLink
                                            href={route('dashboard')}
                                            active={route().current('dashboard')}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            href={route('transaksi')}
                                            active={route().current('transaksi')}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <ArrowLeftRight className="h-4 w-4" />
                                            Transaksi
                                        </NavLink>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <Banknote className="h-4 w-4" />
                                            Stok Valas
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <BookAlert className="h-4 w-4" />
                                            Laporan
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Setting
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <GalleryVerticalEnd className="h-4 w-4" />
                                            Riwayat dan Nota
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                        >
                                            <Users className="h-4 w-4" />
                                            Users
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        <div className="mt-auto border-t p-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex h-auto w-full items-center justify-start gap-2 rounded-lg p-2 text-left"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                            <span className="text-sm font-semibold">
                                                {user.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="truncate text-sm font-medium">
                                                {user.name}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {user.username}
                                            </span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href={route('profile.edit')} className="w-full text-left">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full text-left"
                                        >
                                            Log Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col overflow-x-auto">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">
                                        Toggle navigation menu
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col">
                                <nav className="grid gap-2 text-lg font-medium">
                                    <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                                        <Package className="h-6 w-6" />
                                        <span>Nama Perusahaan</span>
                                    </div>
                                    <div className="px-2 py-2">
                                        <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                                            General
                                        </h3>
                                        <div className="space-y-1">
                                            <NavLink
                                                href={route('dashboard')}
                                                active={route().current('dashboard')}
                                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <LayoutGrid className="h-5 w-5" />
                                                Dashboard
                                            </NavLink>
                                            <Link
                                                href="#"
                                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <ListTodo className="h-5 w-5" />
                                                Tasks
                                            </Link>
                                            <Link
                                                href="#"
                                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <Package className="h-5 w-5" />
                                                Apps
                                            </Link>
                                            <Link
                                                href="#"
                                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <MessageSquare className="h-5 w-5" />
                                                Chats
                                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                                    3
                                                </Badge>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <Users className="h-5 w-5" />
                                                Users
                                            </Link>
                                        </div>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="w-full flex">
                            <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 px-4 py-2 ml-auto">
                                <History className="w-4 h-4 mr-2" />
                                {today}
                            </div>
                        </div>

                    </header>
                    {header && (
                        <header className="shadow">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}