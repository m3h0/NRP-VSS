
'use client';

import { updateProfileImage } from '@/app/actions/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PRESETS = [
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Teacher1',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Teacher2',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Leo',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Mila',
];

export function ChangeAvatar() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState(session?.user?.image || '');
    const [customUrl, setCustomUrl] = useState('');

    async function handleSave() {
        setIsPending(true);
        const finalUrl = customUrl || selectedUrl;

        const formData = new FormData();
        formData.append('imageUrl', finalUrl);

        const result = await updateProfileImage(formData);

        if (result.success) {
            // Update client session immediately
            await update({ image: finalUrl });
            router.refresh();
            setIsOpen(false);
        } else {
            alert('Failed to update avatar');
        }
        setIsPending(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 transition-colors"
            >
                Change Avatar
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Choose Avatar</h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Presets</h3>
                                <div className="grid grid-cols-6 gap-2">
                                    {PRESETS.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSelectedUrl(url); setCustomUrl(''); }}
                                            className={`rounded-full p-1 border-2 transition-all ${selectedUrl === url ? 'border-teal-600 scale-110' : 'border-transparent hover:border-slate-200'}`}
                                        >
                                            <img src={url} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-100" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Or enter URL</h3>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={customUrl}
                                    onChange={(e) => { setCustomUrl(e.target.value); setSelectedUrl(''); }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isPending}
                                    className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Saving...' : 'Save Avatar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
