'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions/auth';
import Link from 'next/link';

interface ThemeClasses {
    primaryText: string;
    primaryTextHover: string;
    primaryBg: string;
    primaryBgHover: string;
    primaryRing: string;
    primaryBorder: string;
    bgLight: string;
    bgMedium: string;
    bgGradientStart: string;
    bgGradientEnd: string;
    iconHoverText: string;
    iconHoverBg: string;
}

export default function LoginForm({
    themeClasses,
    emailPlaceholder = "student@university.edu"
}: {
    themeClasses?: ThemeClasses;
    emailPlaceholder?: string;
}) {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const [isVisible, setIsVisible] = useState(false);

    // Fallback theme if not provided
    const theme = themeClasses || {
        primaryText: 'text-primary',
        primaryTextHover: 'hover:text-primary/80',
        primaryBg: 'bg-primary',
        primaryBgHover: 'hover:bg-primary/90',
        primaryRing: 'focus:ring-primary/20',
        primaryBorder: 'border-primary/20',
        bgLight: 'bg-primary/10',
        bgMedium: 'bg-primary/20',
        bgGradientStart: 'to-primary/20',
        bgGradientEnd: 'from-primary/30',
        iconHoverText: 'group-hover:text-primary',
        iconHoverBg: 'group-hover:bg-primary/10',
    };

    return (
        <form action={dispatch} className="flex flex-col gap-6">
            {/* Email Field */}
            <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    University Email
                </span>
                <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 select-none pointer-events-none transition-colors duration-300">
                        mail
                    </span>
                    <input
                        className={`w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-1 ${theme.primaryRing} transition-colors duration-300`}
                        placeholder={emailPlaceholder}
                        type="email"
                        name="email"
                        required
                    />
                </div>
            </label>

            {/* Password Field */}
            <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                        Password
                    </span>
                    <Link
                        href="#"
                        className={`text-xs font-semibold ${theme.primaryText} ${theme.primaryTextHover} hover:underline transition-colors duration-300`}
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 select-none pointer-events-none transition-colors duration-300">
                        lock
                    </span>
                    <input
                        className={`w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-1 ${theme.primaryRing} transition-colors duration-300`}
                        placeholder="Enter your password"
                        type={isVisible ? "text" : "password"}
                        name="password"
                        required
                        minLength={6}
                    />
                    <button
                        className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {isVisible ? 'visibility' : 'visibility_off'}
                        </span>
                    </button>
                </div>
            </label>

            {/* Error Message */}
            {errorMessage && (
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <span className="text-sm text-red-500">{errorMessage}</span>
                </div>
            )}

            {/* Sign In Button */}
            <LoginButton theme={theme} />

            {/* Divider */}
            <div className="relative flex items-center py-2">
                <div className="grow border-t border-slate-200"></div>
                <span className="mx-4 shrink text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Or continue with
                </span>
                <div className="grow border-t border-slate-200"></div>
            </div>

            {/* SSO Button (Mock for now) */}
            <button
                className="group flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100 active:scale-[0.98]"
                type="button"
            >
                <div className={`flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-600 ${theme.iconHoverBg} ${theme.iconHoverText} transition-colors duration-300`}>
                    <span className="material-symbols-outlined text-[18px]">
                        account_balance
                    </span>
                </div>
                Sign in with University SSO
            </button>
        </form>
    );
}

function LoginButton({ theme }: { theme: ThemeClasses }) {
    const { pending } = useFormStatus();

    return (
        <button
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg ${theme.primaryBg} py-3.5 text-sm font-bold tracking-wide text-white transition-all ${theme.primaryBgHover} focus:ring-4 ${theme.primaryRing} active:scale-[0.98] aria-disabled:cursor-not-allowed aria-disabled:opacity-50 duration-300`}
            type="submit"
            aria-disabled={pending}
        >
            {pending ? 'Signing In...' : 'Sign In'}
        </button>
    );
}
