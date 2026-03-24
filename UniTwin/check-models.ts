
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const keys = Object.keys(prisma);
    const insightKeys = keys.filter(k => /insight/i.test(k));
    console.log('Insight keys:', insightKeys);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
