
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const CourseSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    code: z.string().min(2, "Code must be at least 2 characters"),
    credits: z.coerce.number().min(1, "Credits must be at least 1"),
});

export async function createCourse(formData: FormData) {
    const session = await auth();
    // Only Teachers/Admins can create courses
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const validatedFields = CourseSchema.safeParse({
        name: formData.get('name'),
        code: formData.get('code'),
        credits: formData.get('credits'),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields" }; // Simple error handling
    }

    const { name, code, credits } = validatedFields.data;

    try {
        await prisma.course.create({
            data: {
                name,
                code,
                credits,
            }
        });
    } catch (error) {
        console.error("Course creation failed:", error);
        return { error: "Failed to create course. Code might already exist." };
    }

    revalidatePath('/teacher/courses');
    redirect('/teacher/courses');
}

export async function updateCourse(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const courseId = formData.get('courseId') as string;
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const credits = parseInt(formData.get('credits') as string);
    const description = formData.get('description') as string;

    if (!courseId || !name || !code || !credits) {
        return { error: "Missing required fields" };
    }

    try {
        await prisma.course.update({
            where: { id: courseId },
            data: {
                name,
                code,
                credits,
                description
            }
        });

        revalidatePath(`/teacher/courses/${courseId}`);
        revalidatePath('/teacher/courses');
        return { success: true };
    } catch (error) {
        console.error("Failed to update course:", error);
        return { error: "Failed to update course." };
    }
}
