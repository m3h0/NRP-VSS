
import { prisma } from '@/lib/prisma';

export async function AnnouncementList() {
    const announcements = await prisma.announcement.findMany({
        where: {
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { user: true }
    });

    if (announcements.length === 0) {
        return <p className="text-slate-500 italic">No announcements posted yet.</p>;
    }

    return (
        <>
            {announcements.map(announcement => (
                <div key={announcement.id} className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-indigo-900">{announcement.title}</h3>
                        <span className="text-xs text-indigo-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-indigo-800">{announcement.content}</p>
                    <p className="text-xs text-indigo-400 mt-2">Posted by {announcement.user.name}</p>
                </div>
            ))}
        </>
    );
}
