import { Request, Response } from 'express'
import  AppDataSource  from '../config/database/data-source';
import { Character } from '../models/character.model';
import { CharacterClass } from '../models/characterclass.model';
import { RedisHelper } from '../helpers/redis.helper';
import logger from '../config/logger.config';

export const getAllCharacters = async (req: Request, res: Response) => {

    try {
        const characterRepo = AppDataSource.getRepository(Character);
        const characters = await characterRepo.find({
            select: ['id', 'name', 'health', 'mana']
        })
        return res.json({ characters });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching characters' });
    }
}

export const getCharacterById = async (req: Request, res: Response) => {
    const characterId = req.params.id;
    const cacheKey = `character:${characterId}`;

    try {
        // Initialize Redis connection
        const redis = RedisHelper.getInstance();
        await redis.connect(); // Connect to Redis server

        // Check if the character details are cached
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // If not cached, fetch from the database
        const characterRepo = AppDataSource.getRepository(Character);
        const character = await characterRepo.findOne({
            where: { id: parseInt(characterId, 10) },
            relations: ['items']
        });
       logger.info(`CharacterID: ${characterId}`);
        if (!character) {
            logger.info(`character not found CharacterID: ${characterId}`);
            res.status(400).json({ message: 'character not found' });
        }

        // (available to Game Masters and character owners)
        if (req.user?.role != 'GameMaster' && req.user?.id !== character!.createdBy) {
            logger.warn('Unauthorized attempt to create character: missing user info.');
            res.status(400).json({ message: 'Access denied.' });
        }

        let finalStat = {
            strength: character!.baseStrength,
            agility: character!.baseAgility,
            intelligence: character!.baseIntelligence,
            faith: character!.baseFaith,
        }

        if (character!.items && character!.items.length > 0) {
            character!.items.forEach(item => {
                finalStat.strength += item.bonusStrength;
                finalStat.agility += item.bonusAgility;
                finalStat.intelligence += item.bonusIntelligence;
                finalStat.faith += item.bonusFaith;

            });
        }
        const responseData = { ...character, finalStat };
        // Cache the result for 60 seconds
        await redis.setEx(cacheKey, 60, JSON.stringify(responseData));
        res.json(responseData);
    } catch (error) {
        return res.status(500).json({ message: 'Character not found' });
    }
}

export const createCharacter = async (req: Request, res: Response) => {
    // Expected body: { name, health, mana, baseStrength, baseAgility, baseIntelligence, baseFaith, classId }
    const { name, health, mana, baseStrength, baseAgility, baseIntelligence, baseFaith, classId } = req.body;
  logger.info(`${name} ${health} ${mana} ${baseStrength} ${baseAgility} ${baseIntelligence} ${baseFaith} ${classId}`);
    // Ensure that req.user is available (set by JWT middleware)
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user information found.' });
    }
    logger.info(req.user);
    const createdBy = req.user?.id;

    try {
        const characterClassRepo = AppDataSource.getRepository(CharacterClass);
        const characterClass = await characterClassRepo.findOneBy({ id: classId });
        if (!characterClass) {
            logger.warn(`Character class not found: ${classId}`);
            return res.status(400).json({ message: `Character class with id ${classId} not found` });
        }

        const characterRepo = AppDataSource.getRepository(Character);
        const newCharacter = characterRepo.create({
            name,
            health,
            mana,
            baseStrength,
            baseAgility,
            baseIntelligence,
            baseFaith,
            characterClass: { id: classId },
            createdBy
        });
        const savedCharacter = await characterRepo.save(newCharacter);        
        res.status(201).json(savedCharacter);
    } catch (error) {
        logger.info(error);
        //logger.error('Error creating character:', error);
        res.status(500).json({ message: 'Error creating character' });
    }
}