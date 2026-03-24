
import { prisma } from '@/lib/prisma';

export async function calculateRiskProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            grades: true,
            enrollments: true,
            riskProfile: true
        }
    });

    if (!user) return null;

    // 1. Calculate Dropout Risk based on GPA
    // Formula: (4.0 - GPA) * 20. Lower GPA = Higher Risk.
    let gpa = 0;
    if (user.grades.length > 0) {
        const total = user.grades.reduce((acc, g) => acc + g.grade, 0);
        gpa = total / user.grades.length;
    }
    // Base risk 5%, max 95%
    let dropoutRisk = gpa > 0 ? Math.min(Math.max((4.0 - gpa) * 25, 5), 95) : 15; // Default 15% if no grades

    // 2. Calculate Overload Risk based on Workload
    // Formula: (Total Hours Per Week + (Upcoming Deadlines * 2)) / Capacity
    const totalHours = user.enrollments.reduce((acc, e) => acc + e.hoursPerWeek, 0);

    // Count deadlines in the next 7 days
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const today = new Date();

    // We need to fetch deadlines separately as they are not on User directly
    // Find courses first
    const courseIds = user.enrollments.map(e => e.courseId);
    const upcomingDeadlinesCount = await prisma.deadline.count({
        where: {
            courseId: { in: courseIds },
            dueDate: { gte: today, lte: nextWeek },
            status: { not: 'Completed' }
        }
    });

    // Assume 60 hours is "100% overload"
    const workloadScore = (totalHours + (upcomingDeadlinesCount * 3));
    let overloadRisk = Math.min((workloadScore / 60) * 100, 100);

    // 3. Calculate Attendance/Engagement
    // Check for real attendance data first
    const attendanceRecords = await prisma.attendance.findMany({
        where: { studentId: userId }
    });

    // We also need overdue deadlines for wellbeing score and fallback
    const overdueDeadlines = await prisma.deadline.count({
        where: {
            courseId: { in: courseIds },
            dueDate: { lt: today },
            status: { not: 'Completed' }
        }
    });

    let attendanceRate = 100;

    if (attendanceRecords.length > 0) {
        const presentCount = attendanceRecords.filter(r => ['PRESENT', 'LATE', 'EXCUSED'].includes(r.status)).length;
        attendanceRate = (presentCount / attendanceRecords.length) * 100;
    } else {
        // Fallback: Use "Submission Reliability" as a proxy if no attendance data yet
        // Start at 100%, subtract 5% for every overdue item
        attendanceRate = Math.max(100 - (overdueDeadlines * 5), 0);
    }

    // 4. Calculate Well-being Score
    // Base 100
    // - Subtract Overload Risk * 0.4 (High workload = Low well-being)
    // - Subtract Dropout Risk * 0.2 (Academic stress)
    // - Subtract 5 for every overdue deadline (Anxiety)
    let wellbeingScore = 100 - (overloadRisk * 0.4) - (dropoutRisk * 0.2) - (overdueDeadlines * 5);
    wellbeingScore = Math.max(Math.min(wellbeingScore, 100), 0); // Clamp 0-100

    // Update DB
    const updatedRisk = await prisma.riskProfile.upsert({
        where: { userId: user.id },
        update: {
            dropoutRisk: parseFloat(dropoutRisk.toFixed(1)),
            overloadRisk: parseFloat(overloadRisk.toFixed(1)),
            attendanceRate: parseFloat(attendanceRate.toFixed(1)),
            wellbeingScore: Math.round(wellbeingScore),
            updatedAt: new Date()
        },
        create: {
            userId: user.id,
            dropoutRisk: parseFloat(dropoutRisk.toFixed(1)),
            overloadRisk: parseFloat(overloadRisk.toFixed(1)),
            attendanceRate: parseFloat(attendanceRate.toFixed(1)),
            wellbeingScore: Math.round(wellbeingScore)
        }
    });

    return updatedRisk;
}
