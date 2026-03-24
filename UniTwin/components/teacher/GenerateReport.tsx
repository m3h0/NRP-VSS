
'use client';

import { generateReport } from '@/app/actions/dashboard';
import { useState } from 'react';

export function GenerateReport() {
    const [isPending, setIsPending] = useState(false);

    async function handleGenerate() {
        if (!confirm("Generate student performance report? This may take a moment.")) return;

        setIsPending(true);
        const result = await generateReport();

        if (result.success) {
            alert(result.message);
        } else {
            alert(result.error);
        }
        setIsPending(false);
    }

    return (
        <button
            onClick={handleGenerate}
            disabled={isPending}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group w-full text-left disabled:opacity-50 disabled:cursor-wait"
        >
            <span className="material-symbols-outlined text-3xl text-teal-500 mb-2 group-hover:scale-110 transition-transform">lab_profile</span>
            <span className="font-medium text-slate-700">
                {isPending ? 'Generating...' : 'Generate Report'}
            </span>
        </button>
    );
}
