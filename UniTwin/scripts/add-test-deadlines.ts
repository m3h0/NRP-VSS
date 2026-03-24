
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        include: {
            enrollments: true
        }
    });

    if (!user) {
        console.error('No user found');
        return;
    }

    if (user.enrollments.length === 0) {
        console.error('User has no enrollments to add deadlines to.');
        return;
    }

    const courseId = user.enrollments[0].courseId;

    // Create PAST deadline (Yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.deadline.create({
        data: {
            title: 'Test: Past Assignment',
            dueDate: yesterday,
            courseId: courseId,
            priority: 'High',
            status: 'Incomplete' // Even if incomplete, it should show in "Past due" list or we might want to clarify logic
        }
    });
    console.log(`Created PAST deadline for ${yesterday.toLocaleDateString()}`);

    // Create FUTURE deadline (Tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.deadline.create({
        data: {
            title: 'Test: Future Exam',
            dueDate: tomorrow,
            courseId: courseId,
            priority: 'Medium',
            status: 'Not Started'
        }
    });
    console.log(`Created FUTURE deadline for ${tomorrow.toLocaleDateString()}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
