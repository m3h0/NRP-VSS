
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'test@scv.si';
    console.log(`Starting seed for ${email}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error('User not found. Please register test@scv.si first.');
            return;
        }
        console.log('User found:', user.id);

        // --- CLEANUP ---
        console.log('Cleaning up old data...');
        try {
            await prisma.grade.deleteMany({ where: { userId: user.id } });
            console.log('- Grades deleted');
        } catch (e) { console.warn('Error deleting grades:', e); }

        try {
            // Deadlines are linked to courses, but we want to clear deadlines relevant to this user's courses? 
            // Or just all deadlines for simplicity if we are the only user.
            // Let's rely on wiping enrollments and seeing if we can clean up easier.
            // Actually, let's just delete ALL deadlines for the courses we are about to likely touch.
            // But safer: delete deadlines associated with courses this user is enrolled in.
            const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id } });
            const courseIds = enrollments.map(e => e.courseId);
            if (courseIds.length > 0) {
                await prisma.deadline.deleteMany({ where: { courseId: { in: courseIds } } });
            }
            console.log('- Deadlines deleted');
        } catch (e) { console.warn('Error deleting deadlines:', e); }

        try {
            await prisma.aIInsight.deleteMany({ where: { userId: user.id } });
            console.log('- AIInsights deleted');
        } catch (e) { console.warn('Error deleting AIInsights:', e); }

        try {
            await prisma.enrollment.deleteMany({ where: { userId: user.id } });
            console.log('- Enrollments deleted');
        } catch (e) { console.warn('Error deleting Enrollments:', e); }

        try {
            await prisma.riskProfile.deleteMany({ where: { userId: user.id } });
            console.log('- RiskProfiles deleted');
        } catch (e) { console.warn('Error deleting RiskProfiles:', e); }


        // --- CREATION ---
        console.log('Creating new data...');

        // 1. Courses
        const coursesData = [
            { code: 'CS-201', name: 'Data Structures & Algorithms', description: 'Fundamental data structures and algorithms.' },
            { code: 'MATH-202', name: 'Linear Algebra', description: 'Vector spaces, linear transformations, and matrices.' },
            { code: 'CS-205', name: 'Database Systems', description: 'Relational database design and SQL.' },
            { code: 'ENG-102', name: 'Academic Writing', description: 'Advanced academic writing techniques.' },
        ];

        const courses = [];
        for (const c of coursesData) {
            const course = await prisma.course.upsert({
                where: { code: c.code },
                update: {},
                create: c,
            });
            courses.push(course);
        }
        console.log(`- ${courses.length} Courses ensured`);

        // 2. Risk Profile
        await prisma.riskProfile.create({
            data: {
                userId: user.id,
                dropoutRisk: 12.5,
                overloadRisk: 78.0,
                wellbeingScore: 85,
                attendanceRate: 94.5,
            },
        });
        console.log('- Risk Profile created');

        // 3. Enrollments
        const enrollmentData = [
            { courseId: courses[0].id, currentLoad: 'High', hoursPerWeek: 12 },
            { courseId: courses[1].id, currentLoad: 'Optimal', hoursPerWeek: 8 },
            { courseId: courses[2].id, currentLoad: 'Light', hoursPerWeek: 4 },
        ];

        for (const e of enrollmentData) {
            await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: e.courseId,
                    currentLoad: e.currentLoad,
                    hoursPerWeek: e.hoursPerWeek
                }
            });
        }
        console.log('- Enrollments created');

        // 4. Deadlines
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

        await prisma.deadline.createMany({
            data: [
                { courseId: courses[0].id, title: 'Binary Trees Implementation', dueDate: tomorrow, priority: 'High', status: 'In Progress' },
                { courseId: courses[1].id, title: 'Eigenvalues Problem Set', dueDate: nextWeek, priority: 'Medium', status: 'Not Started' },
                { courseId: courses[2].id, title: 'SQL Normalization Project', dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), priority: 'High', status: 'Not Started' },
            ],
        });
        console.log('- Deadlines created');

        // 5. AI Insight
        await prisma.aIInsight.create({
            data: {
                userId: user.id,
                title: 'Study Pattern anomaly detected',
                content: 'You spent 40% less time on Data Structures this week compared to class average.',
                isDismissed: false,
            },
        });
        console.log('- AI Insight created');

        // 6. Grades
        await prisma.grade.createMany({
            data: [
                { userId: user.id, courseId: courses[0].id, grade: 3.8, semester: 'Sem 1' },
                { userId: user.id, courseId: courses[1].id, grade: 3.5, semester: 'Sem 1' },
                { userId: user.id, courseId: courses[2].id, grade: 3.2, semester: 'Sem 1' },
                { userId: user.id, courseId: courses[0].id, grade: 3.9, semester: 'Sem 2' },
                { userId: user.id, courseId: courses[1].id, grade: 3.6, semester: 'Sem 2' },
                { userId: user.id, courseId: courses[2].id, grade: 3.4, semester: 'Sem 2' },
            ],
        });
        console.log('- Grades created');

        console.log('Seeding completed successfully!');

    } catch (e) {
        console.error('SEEDING ERROR:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
