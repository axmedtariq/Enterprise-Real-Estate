import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Sovereign Vault (SQL Server) Connected");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1);
    }
};

export default prisma;
