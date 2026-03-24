
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile - UniTwin',
};

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            riskProfile: true
        }
    });

    if (!user) redirect('/login');

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Digital Twin Profile</h1>
                <p className="text-slate-500">Manage your personal information and digital twin settings.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">
                        {user.name?.[0] || 'S'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                        <p className="text-slate-500">{user.email}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase text-slate-500">Student ID</label>
                        <p className="text-slate-900 font-medium">#{user.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase text-slate-500">Account Type</label>
                        <p className="text-slate-900 font-medium">Student (Undergraduate)</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase text-slate-500">Major</label>
                        <p className="text-slate-900 font-medium">Computer Science</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase text-slate-500">Joined</label>
                        <p className="text-slate-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Risk Profile Read-only View */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Digital Twin Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-500">Wellbeing Baseline</span>
                        <div className="text-2xl font-bold text-slate-900">{user.riskProfile?.wellbeingScore || 'N/A'}/100</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-500">Dropout Risk Threshold</span>
                        <div className="text-2xl font-bold text-slate-900">{user.riskProfile?.dropoutRisk || 'N/A'}%</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-500">Optimization Goal</span>
                        <div className="text-2xl font-bold text-slate-900">Balanced Load</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
