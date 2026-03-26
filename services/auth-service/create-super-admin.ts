import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createSuperAdmin() {
    try {
        const email = 'admin@sovereign.com';
        const password = 'admin123';
        const name = 'Super Admin';

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            console.log('Admin user already exists. Updating credentials...');
            const hashedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN', // Ensuring role is ADMIN
                    name: name
                }
            });
            console.log('✅ Super Admin credentials updated.');
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Password: ${password}`);
            console.log(`🛡️ Role: ${updatedUser.role}`);
        } else {
            console.log('Creating new Super Admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                    twoFactorEnabled: false
                }
            });
            console.log('✅ Super Admin created successfully.');
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Password: ${password}`);
            console.log(`🛡️ Role: ${newUser.role}`);
        }

    } catch (error) {
        console.error('❌ Error creating/updating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();
