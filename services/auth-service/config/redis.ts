import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3, // Prevent infinite spam if Redis is down
    enableReadyCheck: false,
    retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 50, 2000);
    }
});

redis.on('connect', () => {
    console.log('🚀 SOVEREIGN REDIS: High-Speed Caching Synchronized.');
});

redis.on('error', (err: Error) => {
    console.error('⚠️ SOVEREIGN REDIS: Error detected in the cache layer:', err);
});

export default redis;
