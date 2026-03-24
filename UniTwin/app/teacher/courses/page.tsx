import { CreateCourseButton } from '@/components/teacher/CreateCourseButton';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function TeacherCoursesPage() {
    const session = await auth();

    // Fetch all courses for now. In a real app, maybe filter by teacher if assigned.
    const courses = await prisma.course.findMany({
        orderBy: { code: 'asc' },
        include: {
            _count: {
                select: { enrollments: true }
            }
        }
    });

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>
                    <p className="text-slate-500">Manage your course offerings and curriculum.</p>
                </div>
                <CreateCourseButton />
            </header>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 font-semibold text-slate-700 text-sm">Code</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Course Name</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Credits</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Students</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-900">{course.code}</td>
                                <td className="p-4 text-slate-700">{course.name}</td>
                                <td className="p-4 text-slate-700">{course.credits}</td>
                                <td className="p-4 text-slate-700">
                                    <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-md text-xs font-medium">
                                        <span className="material-symbols-outlined text-[14px]">group</span>
                                        {course._count.enrollments}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link href={`/teacher/courses/${course.id}`} className="text-teal-600 hover:text-teal-800 text-sm font-medium hover:underline">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    No courses found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
