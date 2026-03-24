
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { enrollInCourse } from '@/app/actions/enroll';

export const metadata: Metadata = {
    title: 'Enroll in Course - UniTwin',
};

export default async function EnrollPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    // Fetch all courses
    const allCourses = await prisma.course.findMany();

    // Fetch user's current enrollments
    const userEnrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true },
    });

    const enrolledCourseIds = new Set(userEnrollments.map((e) => e.courseId));

    // Filter available courses
    const availableCourses = allCourses.filter(
        (course) => !enrolledCourseIds.has(course.id)
    );

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">
                    Available Courses
                </h1>
                <p className="text-slate-500">
                    Browse courses to add to your semester workload.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.length > 0 ? (
                    availableCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold mb-2">
                                        {course.code}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                        {course.name}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm flex-1">
                                {course.description}
                            </p>

                            <form action={enrollInCourse} className="mt-4">
                                <input type="hidden" name="courseId" value={course.id} />
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        add_circle
                                    </span>
                                    Enroll Now
                                </button>
                            </form>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">
                            You are enrolled in all available courses!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
