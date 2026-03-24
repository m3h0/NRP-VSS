
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { CalendarSidebar } from '@/components/dashboard/CalendarSidebar';
import { getDeadlineStatus } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Calendar - UniTwin',
};

export default async function CalendarPage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            }
        }
    });

    if (!user) redirect('/login');

    const courses = user.enrollments.map(e => e.course);
    const courseIds = courses.map(c => c.id);

    const deadlines = await prisma.deadline.findMany({
        where: {
            courseId: { in: courseIds }
        },
        include: {
            course: true
        },
        orderBy: { dueDate: 'asc' }
    });

    // Grouping
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = deadlines.filter(d => new Date(d.dueDate) >= today);
    const past = deadlines.filter(d => new Date(d.dueDate) < today);

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
                <p className="text-slate-500">Track your deadlines and exams.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Schedule List */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800">Upcoming Deadlines</h2>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">{upcoming.length} Tasks</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {upcoming.length > 0 ? upcoming.map(deadline => {
                                const { status, color } = getDeadlineStatus(deadline.dueDate);
                                return (
                                    <div key={deadline.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-600">
                                            <span className="text-xs font-bold uppercase">{new Date(deadline.dueDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                                            <span className="text-lg font-bold">{new Date(deadline.dueDate).getDate()}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{deadline.title}</h4>
                                            <p className="text-sm text-slate-500">{deadline.course.code} • {deadline.course.name}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${deadline.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                deadline.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {deadline.priority}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${color}`}>{status}</span>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="p-8 text-center text-slate-500">
                                    No upcoming deadlines. You're clear!
                                </div>
                            )}
                        </div>
                    </div>

                    {past.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden opacity-75">
                            <div className="p-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-bold text-slate-800">Past Due / Completed</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {past.map(deadline => (
                                    <div key={deadline.id} className="p-4 flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-400 grayscale">
                                            <span className="text-xs font-bold uppercase">{new Date(deadline.dueDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                                            <span className="text-lg font-bold">{new Date(deadline.dueDate).getDate()}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-600 line-through decoration-slate-400">{deadline.title}</h4>
                                            <p className="text-sm text-slate-400">{deadline.course.code}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
