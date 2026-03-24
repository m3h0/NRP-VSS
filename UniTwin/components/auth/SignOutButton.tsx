
'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-2 py-1.5 text-xs font-medium text-indigo-400 hover:text-white transition-colors"
        >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
        </button>
    );
}
