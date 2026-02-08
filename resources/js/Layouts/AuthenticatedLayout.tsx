import NavLink from '@/Components/NavLink';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    ArrowLeftRight,
    Banknote,
    BookAlert,
    GalleryVerticalEnd,
    History,
    LayoutGrid,
    ListTodo,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    Settings,
    Users,
} from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const role = user.role;

    const menus = {
        admin: [
            {
                label: 'Dashboard',
                route: 'dashboard',
                icon: LayoutGrid,
            },
            {
                label: 'Laporan',
                route: 'laporan.index',
                icon: BookAlert,
            },
            {
                label: 'Setting',
                route: 'settings',
                icon: Settings,
            },
            {
                label: 'Riwayat dan Nota',
                route: 'riwayat.index',
                icon: GalleryVerticalEnd,
            },
        ],
        staff: [
            {
                label: 'Dashboard',
                route: 'dashboard',
                icon: LayoutGrid,
            },
            {
                label: 'Transaksi',
                route: 'transaksi',
                icon: ArrowLeftRight,
            },
            {
                label: 'Stok Valas',
                route: 'stok-valas',
                icon: Banknote,
            },
            {
                label: 'Laporan',
                route: 'laporan.index',
                icon: BookAlert,
            },
            {
                label: 'Riwayat dan Nota',
                route: 'riwayat.index',
                icon: GalleryVerticalEnd,
            },
        ],
    };

    return (
        <>
            <Toaster position="bottom-right" />
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="sticky top-0 hidden h-screen border-r bg-muted/40 md:block">
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
                                        {menus[role]?.map((menu) => {
                                            const Icon = menu.icon;

                                            return (
                                                <NavLink
                                                    key={menu.route}
                                                    href={route(menu.route)}
                                                    active={route().current(
                                                        menu.route,
                                                    )}
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {menu.label}
                                                </NavLink>
                                            );
                                        })}
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
                                        <Link
                                            href={route('profile.edit')}
                                            className="w-full text-left"
                                        >
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full text-left text-red-600"
                                        >
                                            <LogOut className="text-red mr-2 inline h-4 w-4" />
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
                                    <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
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
                                                active={route().current(
                                                    'dashboard',
                                                )}
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
                        <div className="flex w-full">
                            <div className="ml-auto flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                <History className="mr-2 h-4 w-4" />
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
