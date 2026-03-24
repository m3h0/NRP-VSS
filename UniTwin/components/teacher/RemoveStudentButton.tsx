
'use client';

import { removeStudent } from '@/app/actions/enrollment';
import { useTransition } from 'react';

export function RemoveStudentButton({ enrollmentId, courseId }: { enrollmentId: string, courseId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this student from the course?")) return;

        const formData = new FormData();
        formData.append('enrollmentId', enrollmentId);
        formData.append('courseId', courseId);

        startTransition(async () => {
            await removeStudent(formData);
        });
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isPending}
            className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Remove Student"
        >
            {isPending ? (
                <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
            ) : (
                <span className="material-symbols-outlined text-lg">delete</span>
            )}
        </button>
    );
}
