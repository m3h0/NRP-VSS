
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

    // Get a course ID to associate grades with (or just pick the first one)
    const courseId = user.enrollments[0]?.courseId;

    if (!courseId) {
        console.error('User is not enrolled in any courses to link grades to.');
        // Fallback: Find any course
        const course = await prisma.course.findFirst();
        if (!course) {
            console.error('No courses exist in DB.');
            return;
        }
    }

    // Clear existing grades to avoid duplicates/messy data for this test
    await prisma.grade.deleteMany({
        where: { userId: user.id }
    });

    console.log('Cleared existing grades.');

    // Add grades for 3 semesters to show a trajectory
    const grades = [
        { semester: 'Sem 1', grade: 3.2, courseId: user.enrollments[0]?.courseId || (await prisma.course.findFirst())?.id },
        { semester: 'Sem 1', grade: 3.4, courseId: user.enrollments[0]?.courseId || (await prisma.course.findFirst())?.id }, // Average ~3.3
        { semester: 'Sem 2', grade: 3.5, courseId: user.enrollments[0]?.courseId || (await prisma.course.findFirst())?.id },
        { semester: 'Sem 2', grade: 3.6, courseId: user.enrollments[0]?.courseId || (await prisma.course.findFirst())?.id }, // Average ~3.55
        { semester: 'Sem 3', grade: 3.8, courseId: user.enrollments[0]?.courseId || (await prisma.course.findFirst())?.id }, // Average 3.8
    ];

    for (const g of grades) {
        if (!g.courseId) continue;
        await prisma.grade.create({
            data: {
                userId: user.id,
                courseId: g.courseId,
                grade: g.grade,
                semester: g.semester,
            }
        });
    }

    console.log(`Added ${grades.length} test grades for ${user.email}.`);
    console.log('Refresh the Analytics page to see the GPA Trajectory chart.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
