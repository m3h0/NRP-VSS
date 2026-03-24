
import { auth } from '@/auth';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { prisma } from '@/lib/prisma';
import { ProfileSettings } from '@/components/teacher/ProfileSettings';
import { NotificationSettings } from '@/components/dashboard/settings/NotificationSettings';
import { SecuritySettings } from '@/components/dashboard/settings/SecuritySettings';

export default async function TeacherSettingsPage() {
    const session = await auth();

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account and preferences.</p>
            </header>

            <ProfileSettings />

            <NotificationSettings />
            
            <SecuritySettings />

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Account Actions</h2>
                    <p className="text-sm text-slate-500">Manage your session and login security.</p>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">
                        If you need to sign out of your account on this device, click the button below.
                    </p>
                    <div className="inline-block">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
