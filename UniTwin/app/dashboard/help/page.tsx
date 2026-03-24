
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Help & Support - UniTwin',
    description: 'Find contact information for your teachers and support.',
};

export default async function HelpPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const teachers = await prisma.user.findMany({
        where: {
            role: 'TEACHER',
        },
        orderBy: {
            name: 'asc',
        },
    });

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
                <p className="text-slate-500">Contact your teachers or get technical assistance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Teachers Section */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-slate-900">Your Teachers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <div key={teacher.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                                    {teacher.image ? (
                                        <img
                                            src={teacher.image}
                                            alt={teacher.name || 'Teacher'}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                            {teacher.name?.[0] || 'T'}
                                        </div>
                                    )}
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="font-semibold text-slate-900 truncate">
                                            {teacher.name || 'Unknown Teacher'}
                                        </p>
                                        <a
                                            href={`mailto:${teacher.email}`}
                                            className="text-sm text-slate-500 hover:text-indigo-600 truncate transition-colors block"
                                        >
                                            {teacher.email}
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 col-span-2 italic">No teachers found.</p>
                        )}
                    </div>
                </div>

                {/* Support Section */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-slate-900">Technical Support</h2>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                <span className="material-symbols-outlined">support_agent</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Need technical assistance?</h3>
                                <p className="text-slate-500 text-sm mt-1">If you're experiencing issues with the platform, please contact our support team.</p>
                            </div>
                        </div>
                        <a
                            href="mailto:support@unitwin.edu"
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2 border border-slate-200"
                        >
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                            Contact Support
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                                <span className="material-symbols-outlined">bug_report</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Found a bug?</h3>
                                <p className="text-slate-500 text-sm mt-1">Help us improve by reporting any bugs you encounter.</p>
                            </div>
                        </div>
                        <a
                            href="mailto:bugs@unitwin.edu"
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2 border border-slate-200"
                        >
                            <span className="material-symbols-outlined text-[20px]">bug_report</span>
                            Report Issue
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
