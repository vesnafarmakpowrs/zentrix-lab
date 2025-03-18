import { AppDataSource } from '../config/database/data-source';
import { CharacterClass } from '../models/characterclass.model';
import logger from '../config/logger.config';

async function verifyEntities() {
    try {
        await AppDataSource.initialize();
        const metadata = AppDataSource.getMetadata(CharacterClass);
        logger.info('CharacterClass metadata loaded:', {
            name: metadata.name,
            tableName: metadata.tableName,
            columns: metadata.columns.map(col => col.propertyName)
        });
        process.exit(0);
    } catch (error) {
        logger.error('Entity verification failed:', error);
        process.exit(1);
    }
}

verifyEntities();