
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NotificationBell } from './NotificationBell';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default async function TopHeader() {
    const session = await auth();
    let userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Student';
    let userImage = session?.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGkK9KbI6kDZKTClpau8juOHqpeod_AYG9XVF5Vt3gc7WZ-5NBGAk91g-gpiq46i4-HaWvU5OJMGk-VyE-nh_shdEZD1falAp0XJirhAOcpe6UINgjC4_CEbgwrOkruysrjjrw5aXhfCc0QVeDlWWl2OgfENajkULxasx7CvyvGUdq408jXjLZwSt55ItMRJTGivOLaSXXBgw-Xb_tvtqGwmZmbbByn2maO4ldWHWtHSegq34tbSS-hCB34__urrmElXb7Jn8DTY";

    // Fetch User & Notifications
    let notifications: any[] = [];

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                enrollments: { select: { courseId: true } }
            }
        });

        if (user) {
            // Update details from DB source of truth
            if (user.name) userName = user.name;
            if (user.image) userImage = user.image;

            const courseIds = user.enrollments.map(e => e.courseId);
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingDeadlines = await prisma.deadline.findMany({
                where: {
                    courseId: { in: courseIds },
                    dueDate: { gte: today, lte: nextWeek },
                    status: { not: 'Completed' }
                },
                take: 3,
                orderBy: { dueDate: 'asc' }
            });

            const recentInsights = await prisma.aIInsight.findMany({
                where: { userId: user.id, isDismissed: false },
                take: 2,
                orderBy: { createdAt: 'desc' }
            });

            // Transform to notification format
            notifications = [
                ...upcomingDeadlines.map(d => ({
                    id: d.id,
                    title: `Upcoming: ${d.title}`,
                    message: "Due soon",
                    type: 'deadline',
                    time: new Date(d.dueDate).toLocaleDateString(),
                    href: '/dashboard/calendar'
                })),
                ...recentInsights.map(i => ({
                    id: i.id,
                    title: i.title || 'New AI Insight',
                    message: i.content,
                    type: 'insight',
                    time: 'Just now', // Simplified for demo
                    href: '/dashboard/analytics'
                }))
            ];
        }
    }

    return (
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-700 bg-slate-900 z-40">
            <div className="flex items-center gap-4 lg:hidden">
                <button className="text-slate-300 hover:text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <span className="font-bold text-lg text-white">UniTwin</span>
            </div>
            <div className="hidden lg:block">
                <p className="text-indigo-400 font-medium text-sm flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Last synced: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            <div className="flex items-center gap-4">

                <NotificationBell notifications={notifications} />

                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-slate-600"
                        style={{ backgroundImage: `url("${userImage}")` }}
                    ></div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium leading-tight text-white">
                            {userName}
                        </p>
                        <p className="text-xs text-slate-400">
                            Student
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center border-l border-slate-700 pl-4 ml-2">
                    <SignOutButton />
                </div>
            </div>
        </header>
    );
}
