import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
    try {
        // Production Security Check
        if (process.env.NODE_ENV === 'production') {
            const dbUrl = process.env.DATABASE_URL;
            if (dbUrl && dbUrl.includes('trustServerCertificate=true')) {
                console.warn("⚠️ SECURITY WARNING: Database connection is using 'trustServerCertificate=true'. In production, you must use a valid CA certificate.");
                // ideally, we would fail here, but we will warn for now to avoid breaking the startup if certs aren't ready
            }
        }

        await prisma.$connect();
        console.log("✅ Sovereign Vault (SQL Server) Connected");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1);
    }
};

export default prisma;
