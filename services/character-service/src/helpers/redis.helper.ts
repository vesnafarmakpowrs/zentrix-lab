import { createClient, RedisClientType } from 'redis';

export class RedisHelper {
    private static instance: RedisHelper;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }

    public static getInstance(): RedisHelper {
        if (!RedisHelper.instance) {
            RedisHelper.instance = new RedisHelper();
        }
        return RedisHelper.instance;
    }

    public async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        await this.client.disconnect();
    }

    public async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    public async setEx(key: string, seconds: number, value: string): Promise<void> {
        await this.client.setEx(key, seconds, value);
    }
    
    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async flushAll(): Promise<void> {
        await this.client.flushAll();
    }
}