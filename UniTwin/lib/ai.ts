
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateNewInsight(userId: string) {
    // 1. Fetch relevant user data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            riskProfile: true,
            grades: { orderBy: { semester: 'desc' }, take: 5 },
            enrollments: true,
            aiinsights: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    if (!user) return null;

    // 2. Check if we recently generated one (debounce to avoid spamming every refresh)
    const lastInsight = user.aiinsights[0];
    const now = new Date();
    // If last insight was less than 5 minutes ago, don't generate new one
    if (lastInsight && (now.getTime() - lastInsight.createdAt.getTime()) < 5 * 60 * 1000) {
        return null;
    }

    // 3. "AI" Logic: Analyze data to find the most pressing issue or praise
    let title = '';
    let content = '';
    let type = 'info';

    const risk = user.riskProfile;
    const grades = user.grades;

    // RULE 1: High Dropout Risk
    if (risk && risk.dropoutRisk > 70) {
        title = "Critical Risk Alert";
        content = `Your dropout risk has spiked to ${risk.dropoutRisk}%. We highly recommend scheduling a session with an academic advisor immediately.`;
        type = "urgent";
    }
    // RULE 2: Low Attendance
    else if (risk && risk.attendanceRate < 75) {
        title = "Attendance Warning";
        content = `Your average attendance is ${risk.attendanceRate}%. Missing more classes could result in automatic course failure.`;
        type = "warning";
    }
    // RULE 3: Grade Drop
    else if (grades.length >= 2 && grades[0].grade < grades[1].grade) {
        title = "Performance Dip Detected";
        content = `Your GPA dropped from ${grades[1].grade} to ${grades[0].grade} this semester. Consider reviewing your study schedule.`;
        type = "warning";
    }
    // RULE 4: Good Performance (Default)
    else {
        const messages = [
            { t: "Study Streak", c: "You're consistently meeting deadlines this week. Great momentum!" },
            { t: "Optimization Tip", c: "Based on your calendar, Sunday afternoon is your most productive time. Try scheduling difficult tasks then." },
            { t: "Wellness Check", c: "You have a heavy workload next week. Remember to take short breaks every 45 minutes." }
        ];
        const random = messages[Math.floor(Math.random() * messages.length)];
        title = random.t;
        content = random.c;
    }

    // 4. Save to DB
    const newInsight = await prisma.aIInsight.create({
        data: {
            userId: user.id,
            title,
            content,
            isDismissed: false
        }
    });

    return newInsight;
}
