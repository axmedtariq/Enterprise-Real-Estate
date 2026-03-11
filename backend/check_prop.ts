import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const prop = await prisma.property.findFirst({
        include: { images: true }
    });
    console.log(JSON.stringify(prop, null, 2));
    await prisma.$disconnect();
}
run();
