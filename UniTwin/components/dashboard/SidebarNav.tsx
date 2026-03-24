
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Coursework', href: '/dashboard/coursework', icon: 'menu_book' },
    { name: 'Digital Twin Profile', href: '/dashboard/profile', icon: 'person' },
    { name: 'Risk Analysis', href: '/dashboard/analytics', icon: 'analytics' },
    { name: 'Calendar', href: '/dashboard/calendar', icon: 'calendar_month' },
];

const bottomItems = [
    { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
    { name: 'Help', href: '/dashboard/help', icon: 'help' },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <div className="flex flex-1 flex-col justify-between px-4 py-4">
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all group',
                                isActive
                                    ? 'bg-primary/10 border-l-4 border-primary'
                                    : 'hover:bg-slate-100 border-l-4 border-transparent'
                            )}
                        >
                            <span
                                className={clsx(
                                    'material-symbols-outlined transition-colors',
                                    isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary'
                                )}
                            >
                                {item.icon}
                            </span>
                            <p
                                className={clsx(
                                    'text-sm font-medium leading-normal transition-colors',
                                    isActive ? 'text-primary' : 'text-slate-700 group-hover:text-primary'
                                )}
                            >
                                {item.name}
                            </p>
                        </Link>
                    );
                })}
            </nav>
            <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all group',
                                isActive
                                    ? 'bg-primary/10 border-l-4 border-primary'
                                    : 'hover:bg-slate-100 border-l-4 border-transparent'
                            )}
                        >
                            <span
                                className={clsx(
                                    'material-symbols-outlined transition-colors',
                                    isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary'
                                )}
                            >
                                {item.icon}
                            </span>
                            <p
                                className={clsx(
                                    'text-sm font-medium leading-normal transition-colors',
                                    isActive ? 'text-primary' : 'text-slate-700 group-hover:text-primary'
                                )}
                            >
                                {item.name}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
