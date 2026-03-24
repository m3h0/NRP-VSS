'use client';

import Link from 'next/link';
import { dismissInsight } from '@/app/actions/notifications';
import { useState } from 'react';

export function WelcomeBanner({ name, deadlineCount }: { name: string, deadlineCount: number }) {
    return (
        <div className="lg:col-span-1 rounded-xl relative overflow-hidden flex flex-col justify-end p-6 min-h-[220px] bg-[#192433] shadow-lg">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNrnG3umuCUyDtvs6JPp36mc7ZqAvlVgbjyZjCWHmuzJZVXgFCHJpuEybz4WmCygjc8InOtgIeIYCiqaEQFSXa9kRIc5eg7LlUvz6EC0Z8LVN_f-o-lU0g6gdhXC44k_mlakg8PmvJnhgtaS71hVKO9ECMocoJHj4wId8I_N8-7AaCsQm5QVKN0BuyqI_LG143ooM_HGJnOanSXQ4HJZ1K7hMyreqY9q1JcTcsDJclZ8GG3-dgRtg4uYq8vPGGBskBnUhXH6_U7nQ")',
                }}
            ></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#111822] to-transparent"></div>
            <div className="relative z-10">
                <h2 className="text-white text-3xl font-bold leading-tight mb-2">
                    Welcome back, {name}
                </h2>
                <p className="text-slate-200 text-sm">
                    You have {deadlineCount} upcoming deadlines this week.
                </p>
                <Link href="/dashboard/calendar" className="inline-block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white text-sm font-medium transition-all">
                    View Schedule
                </Link>
            </div>
        </div>
    );
}

export function AIInsightWidget({ insight }: { insight?: any }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!insight || !isVisible) {
        return (
            <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-[#1d283a] to-[#151e2b] border border-slate-700 p-1 shadow-lg relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-20 -right-20 size-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="h-full rounded-lg bg-[#192433]/50 backdrop-blur-sm p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
                    <div className="bg-primary/20 p-3 rounded-full shrink-0">
                        <span className="material-symbols-outlined text-primary text-3xl">
                            auto_awesome
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-lg font-medium leading-snug mb-2">
                            No active alerts
                        </p>
                        <p className="text-[#92a9c9] text-sm leading-relaxed">
                            You are currently on track with all your subjects. Keep up the good work!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-[#1d283a] to-[#151e2b] border border-slate-700 p-1 shadow-lg relative overflow-hidden animate-in fade-in duration-300">
            {/* Decorative Glow */}
            <div className="absolute -top-20 -right-20 size-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="h-full rounded-lg bg-[#192433]/50 backdrop-blur-sm p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
                <div className="bg-primary/20 p-3 rounded-full shrink-0">
                    <span className="material-symbols-outlined text-primary text-3xl">
                        auto_awesome
                    </span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-primary font-bold tracking-wide uppercase text-xs">
                            AI Insight Generated
                        </h3>
                        <span className="text-slate-500 text-xs">• Just now</span>
                    </div>
                    <p className="text-white text-lg font-medium leading-snug mb-2">
                        {insight.title}
                    </p>
                    <p className="text-[#92a9c9] text-sm leading-relaxed">
                        {insight.content}
                    </p>
                </div>
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Link href="/dashboard/analytics" className="flex-1 sm:flex-none px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap text-center">
                        View Analysis
                    </Link>
                    <button
                        onClick={async () => {
                            setIsVisible(false); // Optimistic UI
                            await dismissInsight(insight.id);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-transparent hover:bg-white/5 border border-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
