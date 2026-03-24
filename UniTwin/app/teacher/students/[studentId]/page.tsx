
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { StudentGradeCard } from '@/components/teacher/StudentGradeCard';

interface Props {
    params: Promise<{
        studentId: string;
    }>;
}

export default async function StudentProfilePage({ params }: Props) {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== 'TEACHER' && (session?.user as any)?.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const { studentId } = await params;

    const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: {
            riskProfile: true,
            enrollments: {
                include: {
                    course: true,
                }
            },
            grades: {
                include: {
                    course: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
            attendance: {
                orderBy: {
                    date: 'desc'
                },
                take: 5
            }
        }
    });

    if (!student) {
        notFound();
    }

    // Calculate GPA
    const gpa = student.grades.length > 0
        ? (student.grades.reduce((acc, curr) => acc + curr.grade, 0) / student.grades.length).toFixed(2)
        : 'N/A';

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            {/* Header / Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="shrink-0">
                    {student.image ? (
                        <img
                            src={student.image}
                            alt={student.name || 'Student'}
                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-50"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-4xl border-4 border-slate-50">
                            {student.name?.[0] || 'S'}
                        </div>
                    )}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
                    <p className="text-slate-500 text-lg mb-4">{student.email}</p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">GPA</span>
                            <span className="text-xl font-bold text-slate-900">{gpa}</span>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Courses</span>
                            <span className="text-xl font-bold text-slate-900">{student.enrollments.length}</span>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Risk</span>
                            <span className={`text-xl font-bold ${(student.riskProfile?.dropoutRisk || 0) > 50 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {student.riskProfile?.dropoutRisk ? `${student.riskProfile.dropoutRisk.toFixed(1)}%` : 'Low'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Courses Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-slate-900">Enrolled Courses & Grades</h2>
                    <div className="flex flex-col gap-4">
                        {student.enrollments.map(enrollment => {
                            const courseGrades = student.grades.filter(g => g.courseId === enrollment.courseId);
                            // Serialize dates for client component
                            const formattedGrades = courseGrades.map(g => ({
                                ...g,
                                createdAt: g.createdAt
                            }));

                            return (
                                <StudentGradeCard
                                    key={enrollment.id}
                                    enrollment={enrollment}
                                    grades={formattedGrades}
                                />
                            );
                        })}
                        {student.enrollments.length === 0 && (
                            <p className="text-slate-500 italic">No enrolled courses.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar: Attendance & Risk */}
                <div className="flex flex-col gap-6">
                    {/* Risk Profile Detailed */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Risk Analysis</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Dropout Risk</span>
                                    <span className="font-medium text-slate-900">{student.riskProfile?.dropoutRisk?.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${(student.riskProfile?.dropoutRisk || 0) > 50 ? 'bg-red-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${student.riskProfile?.dropoutRisk || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Attendance Rate</span>
                                    <span className="font-medium text-slate-900">{student.riskProfile?.attendanceRate?.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-blue-500"
                                        style={{ width: `${student.riskProfile?.attendanceRate || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Attendance */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Recent Attendance</h3>
                        <div className="space-y-3">
                            {student.attendance.length > 0 ? (
                                student.attendance.map(record => (
                                    <div key={record.id} className="flex justify-between text-sm items-center border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                        <span className="text-slate-600">{new Date(record.date).toLocaleDateString()}</span>
                                        <span className={`font-bold text-xs px-2 py-0.5 rounded ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                            record.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">No attendance records.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
