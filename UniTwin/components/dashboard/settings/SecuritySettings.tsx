'use client';

import { useState } from 'react';
import { changePassword } from '@/app/actions/settings';

export function SecuritySettings() {
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsChanging(true);
        setError(null);
        setSuccess(null);
        
        try {
            await changePassword(formData);
            setSuccess('Password updated successfully!');
            // clear form (only on the frontend UI)
            (document.getElementById('passwordForm') as HTMLFormElement)?.reset();
        } catch (error) {
            const err = error as Error;
            setError(err.message || 'Failed to update password.');
        } finally {
            setIsChanging(false);
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Security</h2>
                <p className="text-slate-500 text-sm">Protect your account.</p>
            </div>
            <div className="p-6">
                <form id="passwordForm" action={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-6 md:w-1/2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                required
                                minLength={6}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                minLength={6}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {success && <p className="text-green-600 text-sm">{success}</p>}
                    <div className="flex justify-start">
                        <button
                            type="submit"
                            disabled={isChanging}
                            className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            {isChanging ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
