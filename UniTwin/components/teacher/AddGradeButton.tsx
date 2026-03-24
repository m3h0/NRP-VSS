
'use client';

import { useState } from 'react';
import { addGrade } from '@/app/actions/grade';
import { useRouter } from 'next/navigation';

interface AddGradeButtonProps {
    studentId: string;
    courseId: string;
    studentName: string;
}

export function AddGradeButton({ studentId, courseId, studentName }: AddGradeButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const result = await addGrade(formData);

        if (result?.success) {
            setIsOpen(false);
            router.refresh();
        } else {
            alert(result?.error || "Failed to add grade");
        }
        setIsPending(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded hover:bg-teal-100 font-medium transition-colors border border-teal-200"
            >
                Add Grade
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Grade for {studentName}</h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form action={handleSubmit} className="p-6 flex flex-col gap-4">
                            <input type="hidden" name="studentId" value={studentId} />
                            <input type="hidden" name="courseId" value={courseId} />

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Grade (0.0 - 5.0)</label>
                                <input
                                    name="grade"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5.0"
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Semester</label>
                                <select
                                    name="semester"
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="Fall 2024">Fall 2024</option>
                                    <option value="Spring 2025">Spring 2025</option>
                                    <option value="Fall 2025">Fall 2025</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
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
                                    {isPending ? 'Saving...' : 'Save Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
