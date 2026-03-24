
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    type: 'deadline' | 'insight' | 'info';
    time: string;
    href: string;
};

import { markAllAsRead } from '@/app/actions/notifications';

export function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [optimisticNotifications, setOptimisticNotifications] = useState(notifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync optimistic state with props when props change (e.g. on new fetch)
    useEffect(() => {
        setOptimisticNotifications(notifications);
    }, [notifications]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const hasUnread = optimisticNotifications.length > 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 transition-colors rounded-full ${isOpen ? 'bg-slate-100 text-primary' : 'text-slate-300 hover:text-white'}`}
            >
                <span className="material-symbols-outlined">notifications</span>
                {hasUnread && (
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-[100] origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{optimisticNotifications.length} New</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {optimisticNotifications.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {optimisticNotifications.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-4 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${item.type === 'deadline' ? 'bg-red-500' :
                                                item.type === 'insight' ? 'bg-primary' :
                                                    'bg-slate-400'
                                                }`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 leading-snug">{item.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-1.5">{item.time}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">notifications_off</span>
                                <p className="text-sm">No new notifications</p>
                            </div>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                            <button
                                onClick={async () => {
                                    setOptimisticNotifications([]); // Clear immediately
                                    setIsOpen(false);
                                    await markAllAsRead();
                                }}
                                className="text-xs font-medium text-slate-600 hover:text-primary transition-colors"
                            >
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
