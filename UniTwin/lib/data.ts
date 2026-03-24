import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { cache } from 'react';

export const getDashboardData = cache(async () => {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            riskProfile: true,
            grades: true,
            enrollments: {
                include: {
                    course: true,
                },
            },
            aiinsights: {
                where: { isDismissed: false },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });

    if (!user) return null;

    // Dynamic AI: Check if we need to generate a new insight based on current data
    // This makes the system feel "alive" by reacting to data changes
    try {
        const { generateNewInsight } = await import('@/lib/ai');
        await generateNewInsight(user.id);

        // Dynamic Risk: Recalculate risk profile based on real data
        const { calculateRiskProfile } = await import('@/lib/risk');
        await calculateRiskProfile(user.id);
    } catch (e) {
        console.error("Failed to generate AI insight or risk profile:", e);
    }

    // Re-fetch insights and risk profile to include potential updates
    const [updatedInsights, updatedRiskProfile] = await Promise.all([
        prisma.announcement.findMany({
            where: {
                userId: user.id,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 3
        }),
        prisma.riskProfile.findUnique({
            where: { userId: user.id }
        })
    ]);


    // Fetch upcoming deadlines from enrolled courses
    const courseIds = user.enrollments.map((e) => e.courseId);
    const deadlines = await prisma.deadline.findMany({
        where: {
            courseId: { in: courseIds },
            dueDate: { gte: new Date() },
        },
        include: {
            course: true,
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const deadlineCountWeek = await prisma.deadline.count({
        where: {
            courseId: { in: courseIds },
            dueDate: {
                gte: new Date(),
                lte: nextWeek
            }
        }
    });

    return {
        user,
        riskProfile: updatedRiskProfile || user.riskProfile,
        enrollments: user.enrollments,
        grades: user.grades,
        aiInsight: updatedInsights[0] || null,
        deadlines,
        deadlineCountWeek
    };
});
