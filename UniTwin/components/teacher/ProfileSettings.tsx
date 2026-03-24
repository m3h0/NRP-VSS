
'use client';

import { updateProfileName } from '@/app/actions/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChangeAvatar } from './ChangeAvatar';

export function ProfileSettings() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    // Local state for the input
    const [name, setName] = useState(session?.user?.name || '');

    async function handleSave() {
        if (!name || name.trim().length < 2) {
            alert("Name must be at least 2 characters.");
            return;
        }

        setIsPending(true);

        const formData = new FormData();
        formData.append('name', name);

        const result = await updateProfileName(formData);

        if (result.success) {
            await update({ name: name });
            router.refresh();
            alert("Profile updated successfully!");
        } else {
            alert(result.error || 'Failed to update profile');
        }
        setIsPending(false);
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Information</h2>
                <p className="text-sm text-slate-500">Update your account details.</p>
            </div>

            <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            session?.user?.name?.[0] || 'T'
                        )}
                    </div>
                    <div>
                        <ChangeAvatar />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            defaultValue={session?.user?.email || ''}
                            disabled
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-500 bg-slate-100 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-70"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
