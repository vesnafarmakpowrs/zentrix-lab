import 'reflect-metadata';
import { initializeDatabase, closeDatabase } from '../helpers/database.helper';
import { RedisHelper } from '../helpers/redis.helper';
import { app } from '../app';
import { Server } from 'http';
import logger from './logger.config';

let redis: RedisHelper;
let server: Server;

beforeAll(async () => {
    jest.setTimeout(30000);
    logger.info('Setting up test environment...');
    
    try {
        await initializeDatabase();
        redis = RedisHelper.getInstance();
        await redis.connect();
        server = app.listen(0);
        logger.info('Test environment setup completed');
    } catch (error) {
        logger.error('Test environment setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        if (redis) await redis.disconnect();
        await closeDatabase();
        await new Promise<void>((resolve) => server?.close(() => resolve()));
        await new Promise(resolve => setTimeout(resolve, 500));
        logger.info('Test environment cleanup completed');
    } catch (error) {
        logger.error('Test environment cleanup failed:', error);
        throw error;
    }
});