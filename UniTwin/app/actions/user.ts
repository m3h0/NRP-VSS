
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileImage(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    const imageUrl = formData.get('imageUrl') as string;

    if (!imageUrl) {
        return { error: "Image URL is required" };
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { image: imageUrl }
        });

        revalidatePath('/teacher/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile image:", error);
        return { error: "Failed to update profile image." };
    }
}

export async function updateProfileName(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    const name = formData.get('name') as string;

    if (!name || name.trim().length < 2) {
        return { error: "Name must be at least 2 characters" };
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { name: name.trim() }
        });

        revalidatePath('/teacher/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile name:", error);
        return { error: "Failed to update profile name." };
    }
}
