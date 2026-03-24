
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createDeadline(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const title = formData.get('title') as string;
    const dateStr = formData.get('date') as string;
    const priority = formData.get('priority') as string;
    const courseId = formData.get('courseId') as string;

    if (!title || !dateStr || !courseId) {
        return { error: "Missing fields" };
    }

    const dueDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (dueDate < today) {
        return { error: "Deadline cannot be in the past." };
    }

    try {
        await prisma.deadline.create({
            data: {
                title,
                dueDate,
                priority: priority || 'Medium',
                status: 'Not Started',
                courseId
            }
        });

        revalidatePath(`/teacher/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Deadline creation failed:", error);
        return { error: "Failed to create deadline" };
    }
}
