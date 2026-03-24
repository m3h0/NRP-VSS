
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const GradeSchema = z.object({
    studentId: z.string(),
    courseId: z.string(),
    grade: z.coerce.number().min(0).max(5.0),
    semester: z.string().min(1, "Semester is required"),
});

export async function addGrade(formData: FormData) {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== 'TEACHER' && (session?.user as any)?.role !== 'ADMIN') {
        return { error: "Unauthorized" };
    }

    const rawFormData = {
        studentId: formData.get('studentId'),
        courseId: formData.get('courseId'),
        grade: formData.get('grade'),
        semester: formData.get('semester'),
    };

    const validatedFields = GradeSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return { error: "Invalid fields. Grade must be between 0 and 5.0." };
    }

    const { studentId, courseId, grade, semester } = validatedFields.data;

    try {
        await prisma.grade.create({
            data: {
                user: { connect: { id: studentId } },
                course: { connect: { id: courseId } },
                grade,
                semester,
            },
        });

        // Trigger risk profile update for the student
        try {
            const { calculateRiskProfile } = await import('@/lib/risk');
            await calculateRiskProfile(studentId);
        } catch (e) {
            console.error("Failed to update risk profile:", e);
        }

        revalidatePath(`/teacher/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add grade:", error);
        return { error: "Failed to add grade." };
    }
}
