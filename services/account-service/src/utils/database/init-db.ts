import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import logger from '../../config/logger.config';

async function initializeDatabase() {
    const defaultClient = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: 'postgres' // Connect to default database
    });

    try {
        await defaultClient.connect();
        const dbName = process.env.ACCOUNT_DATABASE_NAME;
        logger.info('Attempting to create database:', dbName);

        // First check if database exists
        const checkResult = await defaultClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
        );

        if (checkResult.rows.length === 0) {
            // Database doesn't exist, create it
            // Set autocommit to true to avoid transaction block
            await defaultClient.query('SET autocommit = ON');
            await defaultClient.query(`CREATE DATABASE "${dbName}"`);
            logger.info(`Database ${dbName} created successfully`);
        } else {
            logger.info(`Database ${dbName} already exists`);
        }
    } catch (error) {
        logger.error('Error initializing database:', error);
        throw error;
    } finally {
        await defaultClient.end();
    }
}

export default initializeDatabase;