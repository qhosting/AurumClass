import 'dotenv/config';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://default:aurum-control-center-redis@100.75.220.89:1094';

export const redis = new Redis(redisUrl);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});
