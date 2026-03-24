
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAnnouncement(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
        return { error: "Title and content are required." };
    }

    const duration = parseInt(formData.get('duration') as string || '7');

    let expiresAt = null;
    if (duration > 0) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + duration);
    }

    try {
        await prisma.announcement.create({
            data: {
                title,
                content,
                userId: session.user.id,
                expiresAt
            }
        });

        revalidatePath('/teacher');
        return { success: true };
    } catch (error) {
        console.error("Failed to create announcement:", error);
        return { error: "Failed to create announcement." };
    }
}

export async function generateReport() {
    const session = await auth();
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    // Mock report generation
    // In a real app, this would generate a CSV/PDF and upload to blob storage
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

    return { success: true, message: "Report generated and sent to your email." };
}
