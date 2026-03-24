
'use client';

import { updateProfile } from '@/app/actions/settings';
import { useState } from 'react';

export function ProfileSettings({ user }: { user: any }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await updateProfile(formData);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Profile Settings</h2>
                <p className="text-slate-500 text-sm">Update your personal information.</p>
            </div>
            <div className="p-6">
                <form action={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                        <div
                            className="size-20 rounded-full bg-slate-100 border-2 border-slate-200 bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url("${user.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGkK9KbI6kDZKTClpau8juOHqpeod_AYG9XVF5Vt3gc7WZ-5NBGAk91g-gpiq46i4-HaWvU5OJMGk-VyE-nh_shdEZD1falAp0XJirhAOcpe6UINgjC4_CEbgwrOkruysrjjrw5aXhfCc0QVeDlWWl2OgfENajkULxasx7CvyvGUdq408jXjLZwSt55ItMRJTGivOLaSXXBgw-Xb_tvtqGwmZmbbByn2maO4ldWHWtHSegq34tbSS-hCB34__urrmElXb7Jn8DTY'}")` }}
                        ></div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Profile Picture URL
                            </label>
                            <input
                                type="url"
                                name="image"
                                defaultValue={user.image || ''}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                Paste a direct link to an image (e.g. from Imgur or LinkedIn).
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                defaultValue={user.name || ''}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 focus:bg-white px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                disabled
                                defaultValue={user.email}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-100 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
