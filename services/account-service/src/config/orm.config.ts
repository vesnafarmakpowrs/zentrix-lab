import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../models/user.model';
import * as CreateUserTable from '../migrations/20250318000000-CreateUserTable';
import path from 'path';
import dotenv from 'dotenv';
import logger from './logger.config';
import initializeDatabase from '../utils/database/init-db';

dotenv.config({
    path: path.resolve(__dirname, '../../../../.env')
});

logger.info('Database configuration:', {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.ACCOUNT_DATABASE_NAME
});

const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.ACCOUNT_DATABASE_NAME,
    entities: [User],
    migrations: [CreateUserTable.CreateUserTable20250318000000],
    migrationsRun: true,
    synchronize: false,
    logging: true
};

const AppDataSource = new DataSource(baseConfig);

// Create an async function to initialize everything in order
const initialize = async () => {
    try {
        // First initialize the database
        await initializeDatabase();
        logger.info('Database initialized');
        
        // Then initialize the data source
        await AppDataSource.initialize();
        logger.info('DataSource initialized');
        
        return AppDataSource;
    } catch (error) {
        logger.error('Initialization failed:', error);
        process.exit(1);
    }
};

export default AppDataSource;
export { initialize };