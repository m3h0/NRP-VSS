
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { GPATrajectoryChart } from '@/components/dashboard/Charts';

export const metadata: Metadata = {
    title: 'Analytics - UniTwin',
};

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            riskProfile: true,
            grades: true,
            aiinsights: {
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    });

    if (!user) redirect('/login');

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Analytics & Risk Analysis</h1>
                <p className="text-slate-500">Deep dive into your academic performance predictions.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Performance Trajectory</h2>
                    <div className="relative">
                        {/* Reusing the dashboard chart but perhaps we could make it bigger or add more info here */}
                        <div className="max-w-4xl mx-auto">
                            <GPATrajectoryChart grades={user.grades} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Risk Factors</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">Dropout Risk</span>
                                    <span className="text-sm font-bold text-red-500">{user.riskProfile?.dropoutRisk}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full" style={{ width: `${user.riskProfile?.dropoutRisk}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">Overload Probability</span>
                                    <span className="text-sm font-bold text-orange-500">{user.riskProfile?.overloadRisk}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full" style={{ width: `${user.riskProfile?.overloadRisk}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">Attendance Rate</span>
                                    <span className="text-sm font-bold text-blue-500">{user.riskProfile?.attendanceRate}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full" style={{ width: `${user.riskProfile?.attendanceRate}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">AI Insight Log</h2>
                        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                            {user.aiinsights.length > 0 ? user.aiinsights.map(insight => (
                                <div key={insight.id} className="p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                                    {insight.title && <div className="font-semibold text-slate-800 mb-1">{insight.title}</div>}
                                    <p className="text-slate-600">{insight.content}</p>
                                    <span className="text-xs text-slate-400 mt-2 block">{new Date(insight.createdAt).toLocaleDateString()}</span>
                                </div>
                            )) : (
                                <p className="text-slate-400">No insights generated yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
