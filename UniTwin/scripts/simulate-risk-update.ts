
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        include: {
            riskProfile: true
        }
    });

    if (!user) {
        console.error('No user found');
        return;
    }

    console.log(`Current Risk Profile for ${user.name || user.email}:`);
    console.log(user.riskProfile);

    // Toggle risk values to simulate a dynamic update
    // If current risk is low, make it high, and vice versa.
    const currentDropout = user.riskProfile?.dropoutRisk || 0;
    const newDropout = currentDropout < 50 ? 85 : 12; // Toggle between 12% and 85%

    const currentOverload = user.riskProfile?.overloadRisk || 0;
    const newOverload = currentOverload < 50 ? 78 : 25;

    const currentAttendance = user.riskProfile?.attendanceRate || 95;
    const newAttendance = currentAttendance > 80 ? 60 : 95;

    await prisma.riskProfile.upsert({
        where: { userId: user.id },
        update: {
            dropoutRisk: newDropout,
            overloadRisk: newOverload,
            attendanceRate: newAttendance,
            wellbeingScore: 72, // Arbitrary change
        },
        create: {
            userId: user.id,
            dropoutRisk: newDropout,
            overloadRisk: newOverload,
            attendanceRate: newAttendance,
            wellbeingScore: 72,
        }
    });

    console.log('-----------------------------------');
    console.log('Updated Risk Profile:');
    console.log(`Dropout Risk: ${newDropout}% (was ${currentDropout}%)`);
    console.log(`Overload Risk: ${newOverload}% (was ${currentOverload}%)`);
    console.log(`Attendance: ${newAttendance}% (was ${currentAttendance}%)`);
    console.log('-----------------------------------');
    console.log('Refresh the Analytics page to see these changes.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
