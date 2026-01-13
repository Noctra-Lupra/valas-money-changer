import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ' +
                (active
                    ? 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-gray-50 '
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ') + 
                className
            }
        >
            {children}
        </Link>
    );
}