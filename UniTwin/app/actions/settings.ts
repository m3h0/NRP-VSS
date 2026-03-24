
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const ProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    image: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error('Not authenticated');

    const rawData = {
        name: formData.get('name'),
        image: formData.get('image'),
    };

    const validatedFields = ProfileSchema.safeParse(rawData);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { name, image } = validatedFields.data;

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            name,
            image: image || null,
        },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/profile');
}

export async function changePassword(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error('Not authenticated');

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('All fields are required');
    }

    if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
    }

    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user || !user.password) {
        throw new Error('User not found or no password set (OAuth)');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error('Incorrect current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}
