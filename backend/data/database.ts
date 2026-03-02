import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export const connectDatabase = async () => {
    try {
        if (!prismaInstance) {
            prismaInstance = new PrismaClient();
        }

        // Production Security Check
        if (process.env.NODE_ENV === 'production') {
            const dbUrl = process.env.DATABASE_URL;
            if (dbUrl && dbUrl.includes('trustServerCertificate=true')) {
                console.warn("⚠️ SECURITY WARNING: Database connection is using 'trustServerCertificate=true'. In production, you must use a valid CA certificate.");
            }
        }

        await prismaInstance.$connect();
        console.log("✅ Sovereign Vault (SQL Server) Connected");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1);
    }
};

export const getPrisma = (): PrismaClient => {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
};

// 💎 ELITE PROXY: This allows us to export 'prisma' now, but only instantiate the 
// underlying PrismaClient when any property is first accessed (after Vault injection).
const prismaProxy = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        return (getPrisma() as any)[prop];
    }
});

export default prismaProxy;
