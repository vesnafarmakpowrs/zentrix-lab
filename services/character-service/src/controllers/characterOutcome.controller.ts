import { Request, Response } from 'express';
import  AppDataSource  from '../config/database/data-source';
import { Character } from '../models/character.model';
import { Item } from '../models/item.model';
import logger from '../config/logger.config';

export const updateDuelOutcome = async (req: Request, res: Response) => {
    // Expected payload: { winnerId, loserId, awardedItemId }
    const { winnerId, loserId, awardedItemId } = req.body;
  
    try {
      //update the winner's items, e.g.:
      const characterRepo = AppDataSource.getRepository(Character);
      const winner = await characterRepo.findOne({ where: { id: winnerId }, relations: ['items'] });
      if (!winner) {
        return res.status(404).json({ message: 'Winner not found' });
      }
  
      // Fetch the awarded item 
      const itemRepo = AppDataSource.getRepository(Item);
      const item = await itemRepo.findOne({ where: { id: awardedItemId } });
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Add the item to the winner's items (if not already added)
      winner.items.push(item);
      await characterRepo.save(winner);
  
      res.status(200).json({ message: 'Duel outcome processed, item awarded.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };