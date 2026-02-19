import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const users = [];
    const properties = [];

    // Create 1000 Users
    console.log('Creating 1000 users...');
    for (let i = 0; i < 1000; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(), // In a real app, hash this!
                role: faker.helpers.arrayElement(['USER', 'ADMIN']),
                twoFactorEnabled: faker.datatype.boolean(),
                createdAt: faker.date.past(),
            },
        });
        users.push(user);
        if ((i + 1) % 100 === 0) console.log(`Created ${i + 1} users`);
    }

    // Create 500 Properties
    console.log('Creating 500 properties...');
    for (let i = 0; i < 500; i++) {
        const property = await prisma.property.create({
            data: {
                title: faker.commerce.productName() + ' Apartment',
                price: parseFloat(faker.commerce.price({ min: 100000, max: 5000000 })),
                address: faker.location.streetAddress(),
                lat: faker.location.latitude(),
                lng: faker.location.longitude(),
                description: faker.lorem.paragraph(),
                has3D: faker.datatype.boolean(),
                category: faker.helpers.arrayElement(['buy', 'rent']),
                isVIP: faker.datatype.boolean(),
                videoUrl: faker.image.url(),
                companyId: faker.company.name(), // Random company
                amenities: JSON.stringify(faker.helpers.arrayElements(['WiFi', 'Pool', 'Gym', 'Parking', 'Air Conditioning'], { min: 1, max: 4 })),
                maxGuests: faker.number.int({ min: 1, max: 10 }),
                createdAt: faker.date.past(),
            },
        });
        properties.push(property);

        // Create 1-3 Images for each property
        const numImages = faker.number.int({ min: 1, max: 3 });
        for (let j = 0; j < numImages; j++) {
            await prisma.image.create({
                data: {
                    publicId: faker.string.uuid(),
                    url: faker.image.url(),
                    propertyId: property.id,
                },
            });
        }

        if ((i + 1) % 50 === 0) console.log(`Created ${i + 1} properties`);
    }

    // Create 500 Bookings and Reviews
    console.log('Creating 500 bookings & reviews...');
    for (let i = 0; i < 500; i++) {
        const randomUser = faker.helpers.arrayElement(users);
        const randomProperty = faker.helpers.arrayElement(properties);

        // Booking
        await prisma.booking.create({
            data: {
                startDate: faker.date.future(),
                endDate: faker.date.future(),
                totalPrice: parseFloat(faker.commerce.price({ min: 500, max: 5000 })),
                status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled']),
                guestId: randomUser.id,
                propertyId: randomProperty.id,
            },
        });

        // Review
        await prisma.review.create({
            data: {
                rating: faker.number.int({ min: 1, max: 5 }),
                comment: faker.lorem.sentence(),
                userId: randomUser.id,
                propertyId: randomProperty.id,
            },
        });

        if ((i + 1) % 50 === 0) console.log(`Created ${i + 1} bookings & reviews`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
