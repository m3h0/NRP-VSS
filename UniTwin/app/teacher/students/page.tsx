
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Search from '@/components/Search';

interface Props {
    searchParams: Promise<{
        query?: string;
    }>;
}

export default async function TeacherStudentsPage({ searchParams }: Props) {
    const session = await auth();
    const { query } = await searchParams;

    // Build filter conditions
    const whereCondition: any = { role: 'STUDENT' };

    if (query) {
        whereCondition.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
        ];
    }

    // Fetch students with search filter
    const students = await prisma.user.findMany({
        where: whereCondition,
        include: {
            riskProfile: true,
            _count: {
                select: { enrollments: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Student Directory</h1>
                <p className="text-slate-500">View and manage all registered students.</p>
            </header>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <Search placeholder="Search name or email..." />
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 font-semibold text-slate-700 text-sm">Student</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Courses</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Attendance</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Risk Level</th>
                            <th className="p-4 font-semibold text-slate-700 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => {
                            const attendance = student.riskProfile?.attendanceRate ?? 100;
                            const risk = student.riskProfile?.dropoutRisk ?? 0;

                            let riskBadge = <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Low</span>;
                            if (risk > 75) riskBadge = <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">High Risk</span>;
                            else if (risk > 30) riskBadge = <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Moderate</span>;

                            return (
                                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {student.image ? (
                                                <img src={student.image} alt={student.name || 'User'} className="w-9 h-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                                                    {student.name?.[0] || 'S'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {student._count.enrollments} Enrolled
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${attendance < 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${attendance}%` }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{attendance.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {riskBadge}
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/teacher/students/${student.id}`}
                                            className="text-teal-600 hover:text-teal-800 font-medium text-sm hover:underline"
                                        >
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                        <p>No students found matching your criteria.</p>
                                        {query && (
                                            <Link href="/teacher/students" className="text-teal-600 hover:underline">
                                                Clear search
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
