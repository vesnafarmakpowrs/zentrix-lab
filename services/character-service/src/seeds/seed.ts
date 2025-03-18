import AppDataSource  from '../config/database/data-source';
import { CharacterClass } from '../models/characterclass.model';
import { Item } from '../models/item.model';
import logger from '../config/logger.config';

async function seed() {
  try {
    // Initialize the database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('Database connection initialized');
    }

    // Check if data already exists
    const classRepository = AppDataSource.getRepository(CharacterClass);
    const existingClasses = await classRepository.find();
    
    if (existingClasses.length === 0) {
      // Seed character classes
      const warrior = classRepository.create({ 
        name: 'Warrior', 
        description: 'A strong fighter' 
      });
      const rogue = classRepository.create({ 
        name: 'Rogue', 
        description: 'A nimble and stealthy fighter' 
      });
      
      await classRepository.save([warrior, rogue]);
      logger.info('Character classes seeded');

      // Seed items
      const itemRepository = AppDataSource.getRepository(Item);
      const sword = itemRepository.create({
        name: 'Sword',
        description: 'A sharp blade',
        bonusStrength: 5,
        bonusAgility: 2,
        bonusIntelligence: 0,
        bonusFaith: 1,
      });
      
      await itemRepository.save(sword);
      logger.info('Items seeded');
    } else {
      logger.info('Data already exists, skipping seed');
    }

    await AppDataSource.destroy();
    logger.info('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();