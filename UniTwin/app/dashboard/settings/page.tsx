
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings - UniTwin',
};

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileSettings } from '@/components/dashboard/settings/ProfileSettings';
import { NotificationSettings } from '@/components/dashboard/settings/NotificationSettings';
import { SecuritySettings } from '@/components/dashboard/settings/SecuritySettings';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) redirect('/login');

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and profile.</p>
            </div>

            <ProfileSettings user={user} />
            <NotificationSettings />
            <SecuritySettings />
        </div>
    );
}
