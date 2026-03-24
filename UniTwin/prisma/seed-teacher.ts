
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'teacher@scv.si';
    const password = 'teacher123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Seeding teacher account: ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: Role.TEACHER,
            password: hashedPassword, // Ensure password is set/updated
        },
        create: {
            email,
            name: 'Professor John Doe',
            password: hashedPassword,
            role: Role.TEACHER,
            image: 'https://ui-avatars.com/api/?name=Professor+John+Doe&background=4f46e5&color=fff'
        },
    });

    console.log(`Teacher created/updated: ${user.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
