// If you see a type error for 'redis', run: pnpm add -D @types/redis
import { createClient } from 'redis';


const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err: unknown) => {
  console.error('Redis Client Error', err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (err) {
    console.error('Redis get error:', err);
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds: number) {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.error('Redis set error:', err);
  }
}

export default redisClient;
