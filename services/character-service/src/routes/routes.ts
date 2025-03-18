import {Router} from 'express';
import * as characterController from '../controllers/character.controller';
import * as itemController from '../controllers/item.controller';
import * as characerOutcomeController from '../controllers/characterOutcome.controller';
import { requireGameMaster } from '../middlewares/roleMiddleware';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.get('/character', authenticateJWT, characterController.getAllCharacters);
router.get('/character/:id', authenticateJWT, characterController.getCharacterById);
router.post('/character', authenticateJWT,  characterController.createCharacter);


router.get('/items', requireGameMaster ,itemController.getAllItems);
router.post('/items', itemController.createItem);
router.get('/items/:id', itemController.getItemById);
router.post('/items/post', itemController.grantItem);
router.post('/items/gift', itemController.giftItem);

router.post('/duel/outcome', characerOutcomeController.updateDuelOutcome);

export default router;