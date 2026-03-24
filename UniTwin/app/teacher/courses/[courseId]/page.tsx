
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { AddStudentButton } from '@/components/teacher/AddStudentButton'; // We will create this
import { AddDeadlineButton } from '@/components/teacher/AddDeadlineButton'; // We will create this
import { RemoveStudentButton } from '@/components/teacher/RemoveStudentButton';
// Trigger rebuild
import { EditCourseModal } from '@/components/teacher/EditCourseModal';
import { TakeAttendanceButton } from '@/components/teacher/TakeAttendanceButton';
import { AddGradeButton } from '@/components/teacher/AddGradeButton';

interface Props {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function CourseDetailPage({ params }: Props) {
    const session = await auth();
    const { courseId } = await params;

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            enrollments: {
                include: {
                    user: true
                }
            },
            deadlines: {
                orderBy: { dueDate: 'asc' }
            }
        }
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/teacher/courses" className="hover:text-indigo-600 transition-colors">Courses</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span>{course.code}</span>
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{course.name}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                                {course.code}
                            </span>
                            <span className="text-slate-500 text-sm">
                                {course.credits} Credits
                            </span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">group</span>
                                {course.enrollments.length} Students
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <TakeAttendanceButton courseId={course.id} students={course.enrollments.map(e => e.user)} />
                        <EditCourseModal course={course} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Students */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Enrolled Students</h2>
                        <AddStudentButton courseId={course.id} />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Name</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Email</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {course.enrollments.map(enrollment => (
                                    <tr key={enrollment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                            {enrollment.user.image ? (
                                                <img src={enrollment.user.image} alt={enrollment.user.name || 'User'} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                    {enrollment.user.name?.[0] || 'U'}
                                                </div>
                                            )}
                                            <Link href={`/teacher/students/${enrollment.user.id}`} className="hover:underline hover:text-indigo-600 transition-colors">
                                                {enrollment.user.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">{enrollment.user.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${enrollment.currentLoad === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {enrollment.currentLoad || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <RemoveStudentButton enrollmentId={enrollment.id} courseId={course.id} />
                                            <AddGradeButton
                                                studentId={enrollment.user.id}
                                                courseId={course.id}
                                                studentName={enrollment.user.name || 'Student'}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {course.enrollments.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            No students enrolled yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar: Deadlines & Stats */}
                <div className="flex flex-col gap-6">
                    {/* Deadlines Widget */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Deadlines</h3>
                            <AddDeadlineButton courseId={course.id} />
                        </div>

                        <div className="flex flex-col gap-3">
                            {course.deadlines.map(deadline => (
                                <div key={deadline.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-slate-900 text-sm">{deadline.title}</p>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${deadline.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {deadline.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                        {new Date(deadline.dueDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {course.deadlines.length === 0 && (
                                <p className="text-slate-400 text-sm italic">No active deadlines.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
