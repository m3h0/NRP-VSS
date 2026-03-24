import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { PostAnnouncement } from '@/components/teacher/PostAnnouncement';
import { GenerateReport } from '@/components/teacher/GenerateReport';
import { AnnouncementList } from '@/components/dashboard/AnnouncementList';

export default async function TeacherDashboard() {
    const session = await auth();

    // Fetch Stats
    const studentCount = await prisma.user.count({
        where: { role: 'STUDENT' }
    });

    const courseCount = await prisma.course.count();

    const atRiskCount = await prisma.riskProfile.count({
        where: {
            OR: [
                { dropoutRisk: { gt: 50 } },
                { attendanceRate: { lt: 70 } }
            ]
        }
    });

    const recentDeadlines = await prisma.deadline.findMany({
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: { course: true },
        where: { dueDate: { gte: new Date() } }
    });

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back, {session?.user?.name || 'Professor'}. Here's what's happening.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Students"
                    value={studentCount}
                    icon="groups"
                    color="bg-blue-500"
                    description="Active learners"
                />
                <StatCard
                    title="Active Courses"
                    value={courseCount}
                    icon="library_books"
                    color="bg-teal-500"
                    description="In current semester"
                />
                <StatCard
                    title="At-Risk Students"
                    value={atRiskCount}
                    icon="warning"
                    color="bg-red-500"
                    description="Need intervention"
                />
            </div>

            {/* Announcements Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Announcements</h2>
                <div className="flex flex-col gap-3">
                    {/* We need to fetch announcements here. For now I'm fetching them in the component body. */}
                    <AnnouncementList />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Upcoming Class Deadlines</h2>
                        <Link href="/teacher/courses" className="text-sm text-teal-600 font-medium hover:underline">
                            Manage
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {recentDeadlines.map(deadline => (
                            <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-md border border-slate-200">
                                        <span className="material-symbols-outlined text-slate-500">event</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">{deadline.title}</p>
                                        <p className="text-xs text-slate-500">{deadline.course.code}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${deadline.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {new Date(deadline.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {recentDeadlines.length === 0 && (
                            <p className="text-slate-500 text-center py-4">No upcoming deadlines.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/teacher/courses" className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group">
                            <span className="material-symbols-outlined text-3xl text-teal-500 mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                            <span className="font-medium text-slate-700">Create Course</span>
                        </Link>
                        <Link href="/teacher/students" className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group">
                            <span className="material-symbols-outlined text-3xl text-teal-500 mb-2 group-hover:scale-110 transition-transform">person_add</span>
                            <span className="font-medium text-slate-700">View Students</span>
                        </Link>
                        <PostAnnouncement />
                        <GenerateReport />
                    </div>
                </div>
            </div>
        </div>
    );
}



function StatCard({ title, value, icon, color, description }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
                <p className="text-xs text-slate-400 mt-1">{description}</p>
            </div>
            <div className={`p-3 rounded-lg text-white ${color} shadow-lg shadow-teal-500/20`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
        </div>
    );
}
