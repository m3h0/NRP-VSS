import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { WelcomeBanner, AIInsightWidget } from '@/components/dashboard/WelcomeWidgets';
import { AnnouncementList } from '@/components/dashboard/AnnouncementList';
import HealthStats from '@/components/dashboard/HealthStats';
import { GPATrajectoryChart, WorkloadSummary } from '@/components/dashboard/Charts';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { Metadata } from 'next';
import { getDashboardData } from '@/lib/data';

export const metadata: Metadata = {
    title: 'Dashboard - UniTwin',
    description: 'Student Academic Risk System',
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const data = await getDashboardData();
    const userName = session.user.name || session.user.email?.split('@')[0] || 'Student';

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Welcome & AI Insight Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <WelcomeBanner name={userName} deadlineCount={data?.deadlineCountWeek || 0} />
                <AIInsightWidget insight={data?.aiInsight} />
            </div>

            {/* Announcements Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Class Announcements</h2>
                <div className="flex flex-col gap-3">
                    <AnnouncementList />
                </div>
            </div>

            {/* Health Indicators */}
            <HealthStats profile={data?.riskProfile} />

            {/* Charts & Workload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GPATrajectoryChart grades={data?.grades || []} />
                <WorkloadSummary enrollments={data?.enrollments || []} />
            </div>

            {/* Upcoming Deadlines Table */}
            <UpcomingDeadlines deadlines={data?.deadlines || []} />

            {/* Floating Action Button for Mobile/Quick Actions */}
            <button className="absolute bottom-6 right-6 lg:hidden bg-primary text-white p-4 rounded-full shadow-xl hover:bg-blue-600 transition-colors z-20">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
}
