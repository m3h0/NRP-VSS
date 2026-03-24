
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function enrollStudent(formData: FormData) {
    const session = await auth();
    // Only Teachers/Admins
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const email = formData.get('email') as string;
    const courseId = formData.get('courseId') as string;

    if (!email || !courseId) {
        return { error: "Missing required fields" };
    }

    try {
        // 1. Find the student by email
        const student = await prisma.user.findUnique({
            where: { email }
        });

        if (!student) {
            return { error: "Student not found with that email." };
        }

        // 2. Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: student.id,
                    courseId: courseId
                }
            }
        });

        if (existing) {
            return { error: "Student is already enrolled." };
        }

        // 3. Enroll
        await prisma.enrollment.create({
            data: {
                userId: student.id,
                courseId: courseId,
                currentLoad: "Optimal", // Default
                hoursPerWeek: 0
            }
        });

        revalidatePath(`/teacher/courses/${courseId}`);
        return { success: true };

    } catch (error) {
        console.error("Enrollment failed:", error);
        return { error: "Failed to enroll student." };
    }
}

export async function removeStudent(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const enrollmentId = formData.get('enrollmentId') as string;
    const courseId = formData.get('courseId') as string;

    if (!enrollmentId || !courseId) {
        return { error: "Missing fields" };
    }

    try {
        await prisma.enrollment.delete({
            where: { id: enrollmentId }
        });

        revalidatePath(`/teacher/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Remove student failed:", error);
        return { error: "Failed to remove student." };
    }
}
