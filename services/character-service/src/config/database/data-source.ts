import 'reflect-metadata'; 
import { DataSource, DataSourceOptions } from 'typeorm';
import { Character } from '../../models/character.model';
import { CharacterClass } from '../../models/characterclass.model';
import { Item } from '../../models/item.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../../../.env')
});

const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.CHARACTER_DATABASE_NAME,
    entities: [Character, CharacterClass, Item],
    migrations: [__dirname + '/../../migrations/*.ts'],
    migrationsRun: true,
    synchronize: false,
    logging: true
};

const AppDataSource = new DataSource(baseConfig);

export default AppDataSource;