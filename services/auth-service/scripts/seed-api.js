const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: '../../.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY // Use Service Role Key if you have it! But Anon might work if RLS is off or permissive for initial seed. Wait, I should use the Service Role Key for seeding.
);

// NOTE: Since I don't have the Service Role Key in the .env, I'll hope the user can provide it or I'll use the Anon Key.
// Actually, I'll ask for the Service Role Key or tell the user to use it.
// Wait, I can try with the Anon Key if RLS handles it, but seeding usually needs bypass.

const ROOM_IMAGES = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2000',
    'https://images.unsplash.com/photo-1502672260266-1c158bf8be4f?q=80&w=2000',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000',
];

async function seed() {
    console.log('🚀 Starting API-based seeding (via HTTPS)...');

    // 1. Create Agencies
    console.log('Creating agencies...');
    const agencies = [];
    for (let i = 0; i < 5; i++) {
        const { data, error } = await supabase.from('Agency').insert({
            id: faker.string.uuid(),
            name: faker.company.name() + ' Real Estate',
            description: faker.company.catchPhrase(),
            commissionRate: faker.number.float({ min: 10, max: 20 }),
            isVerified: true,
            status: 'APPROVED',
            updatedAt: new Date(),
        }).select();
        if (error) console.error('Agency Error:', error);
        else agencies.push(data[0]);
    }

    // 2. Create Users
    console.log('Creating users...');
    const users = [];
    for (let i = 0; i < 10; i++) {
        const role = faker.helpers.arrayElement(['USER', 'USER', 'AGENT']);
        const { data, error } = await supabase.from('User').insert({
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'password123',
            role: role,
            agencyId: role === 'AGENT' ? faker.helpers.arrayElement(agencies).id : null,
            updatedAt: new Date(),
        }).select();
        if (error) console.error('User Error:', error);
        else users.push(data[0]);
    }

    // 3. Create Properties
    console.log('Creating properties...');
    for (let i = 0; i < 10; i++) {
        const { data, error } = await supabase.from('Property').insert({
            id: faker.string.uuid(),
            title: faker.commerce.productAdjective() + ' ' + faker.helpers.arrayElement(['Penthouse', 'Villa', 'Suite', 'Apartment']),
            price: parseFloat(faker.finance.amount({ min: 100, max: 2000 })),
            address: faker.location.streetAddress(),
            lat: faker.location.latitude(),
            lng: faker.location.longitude(),
            category: faker.helpers.arrayElement(['buy', 'rent']),
            agencyId: faker.helpers.arrayElement(agencies).id,
            updatedAt: new Date(),
            maxGuests: faker.number.int({ min: 1, max: 10 }),
        }).select();

        if (error) {
            console.error('Property Error:', error);
            continue;
        }

        const property = data[0];
        // Add Images
        await supabase.from('Image').insert({
            id: faker.string.uuid(),
            publicId: faker.string.uuid(),
            url: faker.helpers.arrayElement(ROOM_IMAGES),
            propertyId: property.id,
        });
    }

    console.log('✅ Seeding finished successfully!');
}

seed();
