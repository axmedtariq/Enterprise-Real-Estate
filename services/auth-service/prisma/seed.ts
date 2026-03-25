import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const ROOM_IMAGES = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2000',
    'https://images.unsplash.com/photo-1502672260266-1c158bf8be4f?q=80&w=2000',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000',
];

async function main() {
    console.log('Start seeding ...');

    const existingProperties = await prisma.property.count();
    if (existingProperties > 0) {
        console.log('Database already seeded. Skipping...');
        return;
    }

    // Clean existing database (Order matters due to foreign keys)
    await prisma.review.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.agency.deleteMany({});

    // Create 10 Agencies
    console.log('Creating 10 agencies...');
    const agencies = [];
    for (let i = 0; i < 10; i++) {
        const agency = await prisma.agency.create({
            data: {
                name: faker.company.name() + ' Real Estate',
                description: faker.company.catchPhrase(),
                commissionRate: faker.number.float({ min: 10, max: 20 }),
                isVerified: true,
                status: 'APPROVED',
            },
        });
        agencies.push(agency);
    }

    // Create 100 Users
    console.log('Creating 100 users...');
    const users = [];
    for (let i = 0; i < 100; i++) {
        const role = faker.helpers.arrayElement(['USER', 'USER', 'USER', 'AGENCY_ADMIN', 'AGENT']);
        let agencyId = null;
        if (role === 'AGENCY_ADMIN' || role === 'AGENT') {
            agencyId = faker.helpers.arrayElement(agencies).id;
        }

        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(), // In a real app, hash this!
                role: role,
                agencyId: agencyId,
                twoFactorEnabled: false,
                createdAt: faker.date.past(),
            },
        });
        users.push(user);
    }

    // Create Super Admin
    await prisma.user.create({
        data: {
            name: 'Sovereign Admin',
            email: 'admin@sovereign.com',
            password: 'password123', // In a real app, hash this!
            role: 'SUPER_ADMIN',
            twoFactorEnabled: false,
        }
    });

    // Create 100 Properties
    console.log('Creating 100 properties...');
    const properties = [];
    for (let i = 0; i < 100; i++) {
        const property = await prisma.property.create({
            data: {
                title: faker.commerce.productAdjective() + ' ' + faker.helpers.arrayElement(['Penthouse', 'Villa', 'Suite', 'Apartment']),
                price: parseFloat(faker.finance.amount({ min: 100, max: 2000 })),
                address: faker.location.streetAddress() + ', ' + faker.location.city(),
                lat: faker.location.latitude(),
                lng: faker.location.longitude(),
                description: "Experience world-class luxury and service in this spectacular property. The perfect blend of comfort and style, featuring magnificent views and top-tier amenities. " + faker.lorem.paragraph(),
                has3D: faker.datatype.boolean(),
                category: faker.helpers.arrayElement(['buy', 'rent']),
                isVIP: faker.datatype.boolean(),
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                agencyId: faker.helpers.arrayElement(agencies).id,
                amenities: JSON.stringify(faker.helpers.arrayElements(['WiFi', 'Pool', 'Gym', 'Parking', 'Air Conditioning', 'Room Service', 'Spa', 'Balcony'], { min: 3, max: 6 })),
                maxGuests: faker.number.int({ min: 1, max: 10 }),
                createdAt: faker.date.past(),
            },
        });
        properties.push(property);

        // Add 3-5 Images for each property as requested (showcasing each room)
        const numImages = faker.number.int({ min: 3, max: 5 });
        const selectedImages = faker.helpers.arrayElements(ROOM_IMAGES, numImages);

        for (let j = 0; j < selectedImages.length; j++) {
            await prisma.image.create({
                data: {
                    publicId: faker.string.uuid(),
                    url: selectedImages[j],
                    propertyId: property.id,
                },
            });
        }
    }

    // Create 100 Bookings and Reviews
    console.log('Creating 100 bookings & reviews...');
    for (let i = 0; i < 100; i++) {
        const randomUser = faker.helpers.arrayElement(users.filter(u => u.role === 'USER'));
        const randomProperty = faker.helpers.arrayElement(properties);

        // Booking
        await prisma.booking.create({
            data: {
                startDate: faker.date.soon(),
                endDate: faker.date.future(),
                totalPrice: randomProperty.price * faker.number.int({ min: 1, max: 7 }),
                status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled']),
                guestId: randomUser.id,
                propertyId: randomProperty.id,
            },
        });

        // Review with some comments
        await prisma.review.create({
            data: {
                rating: faker.number.int({ min: 3, max: 5 }),
                comment: "The rooms looked exactly like the pictures! Outstanding experience.",
                userId: randomUser.id,
                propertyId: randomProperty.id,
            },
        });
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
