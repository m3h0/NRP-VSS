
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const EnrollmentSchema = z.object({
    courseId: z.string(),
});

export async function enrollInCourse(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    const courseId = formData.get('courseId');
    const validatedFields = EnrollmentSchema.safeParse({ courseId });

    if (!validatedFields.success) {
        throw new Error('Invalid course ID');
    }

    const { courseId: cid } = validatedFields.data;

    // Fetch course to get credits for load calculation
    const course = await prisma.course.findUnique({
        where: { id: cid },
        select: { credits: true }
    });

    const credits = course?.credits || 3;

    // Calculate load: Credits * 2 = Hours/Week (as per user preference)
    const hoursPerWeek = credits * 2;

    // Determine load category
    let currentLoad = 'Optimal';
    if (hoursPerWeek >= 10) currentLoad = 'High';
    else if (hoursPerWeek <= 4) currentLoad = 'Light';

    try {
        await prisma.enrollment.create({
            data: {
                userId: session.user.id,
                courseId: cid,
                currentLoad,
                hoursPerWeek,
            },
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        // Handle unique constraint violation (already enrolled) gracefully if needed
    }

    revalidatePath('/dashboard/coursework');
    revalidatePath('/dashboard');
    redirect('/dashboard/coursework');
}
