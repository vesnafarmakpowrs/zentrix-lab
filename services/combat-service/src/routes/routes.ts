import Router from 'express'
import * as duelController from '../controllers/duel.controller'

const router = Router();

router.post('/challenge', duelController.initiateChallenge);

router.post('/:duel_id/attack', duelController.attack);
router.post('/:duel_id/cast', duelController.castSpell);
router.post('/:duel_id/heal', duelController.heal);

export default router