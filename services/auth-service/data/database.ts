import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export const connectDatabase = async () => {
    try {
        if (!prismaInstance) {
            prismaInstance = new PrismaClient();
        }

        await prismaInstance.$connect();
        console.log("✅ Sovereign Data (Supabase/PostgreSQL) Connected");
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
