
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function markAllAsRead() {
    const session = await auth();
    if (!session?.user?.id) return;

    // 1. Mark all AI Insights as dismissed
    await prisma.aIInsight.updateMany({
        where: {
            userId: session.user.id,
            isDismissed: false,
        },
        data: {
            isDismissed: true,
        },
    });

    // 2. For Deadlines, we can't "dismiss" them permanently without a schema change (e.g. UserDeadlineDismissal),
    // but for now, this action mainly clears the persistent "Insights".
    // The client-side optimistic update will clear everything for the session.

    revalidatePath('/dashboard');
}

export async function dismissInsight(insightId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.aIInsight.update({
        where: {
            id: insightId,
            userId: session.user.id
        },
        data: {
            isDismissed: true
        }
    });

    revalidatePath('/dashboard');
}
