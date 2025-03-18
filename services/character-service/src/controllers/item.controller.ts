import {Response, Request} from 'express'
import AppDataSource from '../config/database/data-source';
import { Item } from '../models/item.model';

// GET /api/items - List all items 
export const getAllItems = async (res: Response, req: Request)=>{
    if (req.user?.role !== 'GameMaster') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const itemsRepo = AppDataSource.getRepository(Item);
        const items = itemsRepo.find();

        res.json(items);
  } catch (error) {
        res.status(500).json({message:'Error fetching items'});
  }
};

// POST /api/items - Create a new item
export const createItem = async(res: Response, req: Request) =>{
    const { name, description, bonusStrength, bonusAgility, bonusIntelligence, bonusFaith } = req.body;
    try {
      const itemRepo = AppDataSource.getRepository(Item);
      const newItem = itemRepo.create({
        name,
        description,
        bonusStrength,
        bonusAgility,
        bonusIntelligence,
        bonusFaith,
      });
      const savedItem = await itemRepo.save(newItem);
      res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({message:'Error creating item'})
    }
}

// GET /api/items/:id - Retrieve item details and update name based on highest bonus stat
export const getItemById = async(res: Response, req: Request)=> {
    const itemId = req.params.id;
    try {
       const itemsRepo = AppDataSource.getRepository(Item);
       const item = await itemsRepo.findOne({
            where: {id: parseInt(itemId,10)}
        }) ;
        if (!item){
            return res.status(404).json({message: 'Item not found'});
        }

        res.json({ ...item, displayName: item.displayName });
    } catch (error) {
        res.status(500).json({message:'Item not found'})
    }
}

// POST /api/items/grant - Assigns an item to a character
export const grantItem = async(res: Response, req: Request)=> {
    const { characterId, itemId } = req.body;
    try {
        await AppDataSource.query(
            `INSERT INTO character-items (character_id,item_id) VALUES ($1, $2)`,
            [characterId, itemId]
        );

        res.json({ message: 'Item granted successfully.' });
        
    } catch (error) {
        res.status(500).json({message:'Error granting item'})
    }
}

// POST /api/items/gift - Transfers an item from one character to another
export const giftItem= async(res: Response, req: Request)=> {
    const { fromCharacterId, toCharacterId, itemId } = req.body;
    try {
        const ownership = await AppDataSource.query(
            `SELECT * FROM character_items WHERE character_id = $1 AND item_id = $2`,
            [fromCharacterId, itemId]
          );
          if (!ownership || ownership.length === 0) {
            return res.status(400).json({ message: 'Item is not owned by the source character.' });
          }
        // Remove item from source character.
        await AppDataSource.query(
            `DELETE FROM character_items WHERE character_id = $1 AND item_id = $2`,
            [fromCharacterId, itemId]
        );
        // Assign item to target character.
        await AppDataSource.query(
            `INSERT INTO character_items (character_id, item_id) VALUES ($1, $2)`,
            [toCharacterId, itemId]
        );
        res.json({ message: 'Item transferred successfully.' });
            
    } catch (error) {
        res.status(500).json({message:'Error transferring item'})
    }
}