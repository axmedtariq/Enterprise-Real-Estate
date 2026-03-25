import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    try {
        const userCount = await prisma.user.count();
        const propertyCount = await prisma.property.count();
        const bookingCount = await prisma.booking.count();
        const reviewCount = await prisma.review.count();

        console.log('--- DATABASE STATUS ---');
        console.log(`✅ Users:      ${userCount}`);
        console.log(`✅ Properties: ${propertyCount}`);
        console.log(`✅ Bookings:   ${bookingCount}`);
        console.log(`✅ Reviews:    ${reviewCount}`);
        console.log('-----------------------');

        if (userCount > 0) {
            console.log("\nSample User:");
            const user = await prisma.user.findFirst();
            console.log(user);
        }

    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
