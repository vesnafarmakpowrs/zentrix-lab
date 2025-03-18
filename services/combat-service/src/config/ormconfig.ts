import {DataSource}  from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, 
  synchronize: true,            // Set to true only in production
  logging: false,
  entities: ['src/models/**/*.ts'], 
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'], 
});

export default AppDataSource;