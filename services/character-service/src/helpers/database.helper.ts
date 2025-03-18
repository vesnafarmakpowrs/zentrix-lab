import { DataSource } from 'typeorm';
import configuredTestDataSource from '../config/database/data-source';
import { CharacterClass } from '../models/characterclass.model';
import logger from '../config/logger.config';

export let testDataSource: DataSource | null = null;

export async function initializeDatabase(): Promise<DataSource> {
    try {
        await closeDatabase();

        testDataSource = configuredTestDataSource;
        await testDataSource.initialize();
        
        // Drop and recreate schema
        await testDataSource.query('DROP SCHEMA IF EXISTS public CASCADE');
        await testDataSource.query('CREATE SCHEMA public');
        await testDataSource.synchronize();
        
        logger.info('Test database initialized');
        return testDataSource;
    } catch (error) {
        logger.error('Database initialization failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            details: error
        });
        throw error;
    }
}

export async function clearTables(): Promise<void> {
    if (!testDataSource?.isInitialized) {
        throw new Error('Test database not initialized');
    }

    try {
        // Drop all table data while maintaining sequences and constraints
        await testDataSource.query(`
            DO $$ 
            DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        `);
        logger.info('Tables cleared successfully');
    } catch (error) {
        logger.error('Error clearing tables:', error);
        throw error;
    }
}

export async function createTestCharacterClass(): Promise<CharacterClass> {
    if (!testDataSource?.isInitialized) {
        throw new Error('Test database not initialized');
    }

    try {
        // Check if class already exists
        const characterClassRepo = testDataSource.getRepository(CharacterClass);
        let characterClass = await characterClassRepo.findOne({ 
            where: { name: 'Warrior' } 
        });

        if (!characterClass) {
            // Create new if doesn't exist
            characterClass = characterClassRepo.create({
                name: 'Warrior',
                description: 'A mighty warrior'
            });
            characterClass = await characterClassRepo.save(characterClass);
            logger.info(`Test character class created: ${characterClass.name}`);
        } else {
            logger.info(`Using existing character class: ${characterClass.name}`);
        }

        return characterClass;
    } catch (error) {
        logger.error('Error creating test character class:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            details: error
        });
        throw error;
    }
}

export async function closeDatabase(): Promise<void> {
    if (testDataSource?.isInitialized) {
        try {
            await testDataSource.destroy();
            testDataSource = null;
            logger.info('Test database connection closed');
        } catch (error) {
            logger.error('Error closing database:', error);
            throw error;
        }
    }
}