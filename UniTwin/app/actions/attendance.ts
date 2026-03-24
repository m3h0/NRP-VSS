
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function logAttendance(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const courseId = formData.get('courseId') as string;
    const dateStr = formData.get('date') as string;
    const date = new Date(dateStr);

    if (!courseId || !dateStr) {
        return { error: "Course ID and Date are required." };
    }

    const entries = Array.from(formData.entries())
        .filter(([key]) => key.startsWith('status-'))
        .map(([key, value]) => ({
            studentId: key.replace('status-', ''),
            status: value as string
        }));

    try {
        // Use a transaction to handle multiple upserts efficiently
        await prisma.$transaction(
            entries.map(entry =>
                prisma.attendance.upsert({
                    where: {
                        studentId_courseId_date: {
                            studentId: entry.studentId,
                            courseId: courseId,
                            date: date
                        }
                    },
                    update: {
                        status: entry.status
                    },
                    create: {
                        studentId: entry.studentId,
                        courseId: courseId,
                        date: date,
                        status: entry.status
                    }
                })
            )
        );

        revalidatePath(`/teacher/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to log attendance:", error);
        return { error: "Failed to log attendance." };
    }
}

export async function getCourseAttendance(courseId: string, dateStr: string) {
    const session = await auth();
    if (!session?.user) return null;

    const date = new Date(dateStr);

    const records = await prisma.attendance.findMany({
        where: {
            courseId: courseId,
            date: date
        }
    });

    return records;
}
