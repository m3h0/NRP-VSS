'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { register } from '@/app/actions/auth';
import Link from 'next/link';

export default function RegisterForm() {
    const [errorMessage, dispatch] = useActionState(register, undefined);
    const [isVisible, setIsVisible] = useState(false);

    return (
        <form action={dispatch} className="flex flex-col gap-6">
            {/* Email Field */}
            <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    University Email
                </span>
                <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 select-none pointer-events-none">
                        mail
                    </span>
                    <input
                        className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="student@university.edu"
                        type="email"
                        name="email"
                        required
                    />
                </div>
            </label>

            {/* Password Field */}
            <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    Password
                </span>
                <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 select-none pointer-events-none">
                        lock
                    </span>
                    <input
                        className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Create a password"
                        type={isVisible ? "text" : "password"}
                        name="password"
                        required
                        minLength={6}
                    />
                    <button
                        className="absolute right-4 text-slate-400 hover:text-slate-600"
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

            {/* Sign Up Button */}
            <RegisterButton />
        </form>
    );
}

function RegisterButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold tracking-wide text-white transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 active:scale-[0.98] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            type="submit"
            aria-disabled={pending}
        >
            {pending ? 'Creating Account...' : 'Create Account'}
        </button>
    );
}
