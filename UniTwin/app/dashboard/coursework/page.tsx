
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { AddGradeButton } from '@/components/dashboard/AddGradeButton';

export const metadata: Metadata = {
    title: 'Coursework - UniTwin',
};

export default async function CourseworkPage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            attendance: true, // Fetch all attendance records for the user
            enrollments: {
                include: {
                    course: {
                        include: {
                            deadlines: {
                                where: { status: { not: 'Completed' } },
                                orderBy: { dueDate: 'asc' },
                                take: 3
                            },
                            // We also need total classes to calculate percentage, but that's hard.
                            // Let's just show total attended for now.
                        }
                    },
                },
            },
        },
    });

    if (!user) redirect('/login');

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-slate-900">Coursework</h1>
                    <p className="text-slate-500">Manage your courses, assignments, and study workload.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.enrollments.map((enrollment) => {
                    const courseAttendance = user.attendance.filter(a => a.courseId === enrollment.courseId && a.status === 'PRESENT');

                    return (
                        <div key={enrollment.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold mb-2">
                                        {enrollment.course.code}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                        {enrollment.course.name}
                                    </h3>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${(enrollment.course.credits * 2) >= 10 ? 'bg-red-500' :
                                    (enrollment.course.credits * 2) <= 4 ? 'bg-blue-500' : 'bg-green-500'
                                    }`} title={`Load: ${(enrollment.course.credits * 2) >= 10 ? 'High' : (enrollment.course.credits * 2) <= 4 ? 'Light' : 'Optimal'}`}></div>
                            </div>

                            <p className="text-slate-500 text-sm line-clamp-2">
                                {enrollment.course.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Study Load</span>
                                    <span className="font-medium text-slate-700">{enrollment.course.credits * 2} hrs/week</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Attendance</span>
                                    <span className="font-medium text-green-600">
                                        {courseAttendance.length} Classes Attended
                                    </span>
                                </div>

                                {enrollment.course.deadlines.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming</span>
                                        {enrollment.course.deadlines.map(deadline => (
                                            <div key={deadline.id} className="flex justify-between items-center text-xs">
                                                <span className="text-slate-700 truncate max-w-[150px]">{deadline.title}</span>
                                                <span className="text-red-500 font-medium whitespace-nowrap">
                                                    {new Date(deadline.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Add New Course Link */}
                <Link
                    href="/dashboard/coursework/enroll"
                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary transition-colors min-h-[300px]"
                >
                    <span className="material-symbols-outlined text-4xl">add_circle</span>
                    <span className="font-medium">Enroll in Course</span>
                </Link>
            </div>
        </div>
    );
}
