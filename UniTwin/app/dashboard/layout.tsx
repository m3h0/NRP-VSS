import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    // Redirect Teachers/Admins to their own portal
    if (session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN') {
        redirect('/teacher');
    }

    return (
        <div className="flex h-screen w-full bg-background-light font-display text-slate-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <TopHeader />
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
