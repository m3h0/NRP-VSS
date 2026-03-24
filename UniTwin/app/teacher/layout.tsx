
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Role Check
    if (!session?.user) redirect('/login');
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
        // Optionally redirect to dashboard if they are a student trying to access teacher panel
        // redirect('/dashboard');
        // For now, let's just let them in if we haven't migrated roles yet, OR show an unauthorized page.
        // But since we defaulted everyone to STUDENT, I will need to manually update the user to TEACHER to test.
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Teacher Sidebar */}
            <aside className="w-64 bg-teal-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl">
                <div className="p-6 border-b border-teal-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg">
                            <span className="material-symbols-outlined text-teal-700">school</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">UniTwin</h1>
                            <p className="text-xs text-teal-300">Teacher Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <TeacherNavItem href="/teacher" icon="dashboard" label="Overview" />
                    <TeacherNavItem href="/teacher/courses" icon="library_books" label="Course Management" />
                    <TeacherNavItem href="/teacher/students" icon="groups" label="Students" />
                    <TeacherNavItem href="/teacher/settings" icon="settings" label="Settings" />
                </nav>

                <div className="p-4 bg-teal-950">
                    <div className="flex items-center gap-3 mb-3">
                        {session.user.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full object-cover bg-teal-700" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center font-bold">
                                {session.user.name?.[0] || 'T'}
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{session.user.name}</p>
                            <p className="text-xs text-teal-400 truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pl-64 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function TeacherNavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-800 transition-colors text-teal-100 hover:text-white group"
        >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">{icon}</span>
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );
}
