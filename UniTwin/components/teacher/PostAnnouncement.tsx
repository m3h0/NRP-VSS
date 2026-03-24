
'use client';

import { createAnnouncement } from '@/app/actions/dashboard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PostAnnouncement() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const result = await createAnnouncement(formData);

        if (result.success) {
            setIsOpen(false);
            router.refresh();
            alert("Announcement posted!");
        } else {
            alert(result.error);
        }
        setIsPending(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group w-full text-left"
            >
                <span className="material-symbols-outlined text-3xl text-teal-500 mb-2 group-hover:scale-110 transition-transform">campaign</span>
                <span className="font-medium text-slate-700">Post Announcement</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">New Announcement</h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form action={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                                <input
                                    name="title"
                                    required
                                    placeholder="e.g., Midterm Schedule Change"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Content</label>
                                <textarea
                                    name="content"
                                    required
                                    rows={4}
                                    placeholder="Write your announcement here..."
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Duration</label>
                                <select
                                    name="duration"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    defaultValue="7"
                                >
                                    <option value="1">24 Hours</option>
                                    <option value="3">3 Days</option>
                                    <option value="7">1 Week</option>
                                    <option value="14">2 Weeks</option>
                                    <option value="30">1 Month</option>
                                    <option value="0">No Expiration</option>
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
                                    {isPending ? 'Posting...' : 'Post Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
