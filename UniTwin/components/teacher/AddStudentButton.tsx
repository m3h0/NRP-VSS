
'use client';

import { useState } from 'react';
import { enrollStudent } from '@/app/actions/enrollment';

export function AddStudentButton({ courseId }: { courseId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setError('');

        const result = await enrollStudent(formData);

        setIsPending(false);
        if (result?.error) {
            setError(result.error);
        } else {
            setIsOpen(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Enroll Student
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Enroll Student</h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form action={handleSubmit} className="p-6 flex flex-col gap-4">
                            <input type="hidden" name="courseId" value={courseId} />

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Student Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                                    {error}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Enrolling...' : 'Enroll'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
