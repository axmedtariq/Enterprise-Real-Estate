import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
});

redis.on('connect', () => {
    console.log('🚀 SOVEREIGN REDIS: High-Speed Caching Synchronized.');
});

redis.on('error', (err: Error) => {
    console.error('⚠️ SOVEREIGN REDIS: Error detected in the cache layer:', err);
});

export default redis;
