
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();

    if (!user) {
        console.error('No user found');
        return;
    }

    console.log(`Generating insights for ${user.email}...`);

    // Define some sample insights
    const insights = [
        {
            title: "Study Pattern Detected",
            content: "You tend to submit assignments late on Sundays. Consider starting on Friday to reduce weekend stress.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
            title: "Grade Improvement",
            content: "Your grade in Calculus II has trended upwards by 0.4 points this month. Keep it up!",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
        },
        {
            title: "Burnout Warning",
            content: "Your workload for next week is 20% higher than your average. Schedule some downtime.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
        },
        {
            title: "Attendance Alert",
            content: "You missed 2 classes in Data Structures. Missing one more might impact your grade.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
        }
    ];

    // Optional: Delete old "Dismissed" ones to clean up, or just add new ones.
    // Let's just add new ones.

    for (const insight of insights) {
        await prisma.aIInsight.create({
            data: {
                userId: user.id,
                title: insight.title,
                content: insight.content,
                createdAt: insight.createdAt,
                isDismissed: false
            }
        });
    }

    console.log(`Added ${insights.length} new AI insights.`);
    console.log('Refresh the Analytics page to see the new log entries.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
