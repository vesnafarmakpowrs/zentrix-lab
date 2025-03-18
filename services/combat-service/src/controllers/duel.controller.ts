import { Request, Response } from 'express'
import { notifyDuelOutcome } from '../services/duelNotification.service';

interface Duel {
    id: string;
    challengerId: number;
    opponentId: number;
    challengerHealth: number;
    opponentHealth: number;
    turn: 'challenger' | 'opponent';
    startedAt: number;
}

const duels: { [id: string]: Duel } = {};

// Helper to check duel timeout (5 minutes)
const isDuelTimedOut = (duel: Duel): boolean => {
    return Date.now() - duel.startedAt > 5 * 60 * 1000;
};

// POST /api/challenge - Initiate a duel
export const initiateChallenge = async (res: Response, req: Request) => {
    const { challengerId, opponentId } = req.body;
    const duelId = `${Date.now}`;
    const newDuel: Duel = {
        id: duelId,
        challengerId,
        opponentId,
        challengerHealth: 100,//starting health
        opponentHealth: 100,
        turn: 'challenger',
        startedAt: Date.now(),
    }

    duels[duelId] = newDuel;
    res.status(201).json({ duelId: duelId, duel: newDuel });

}

// POST /api/:duel_id/attack - Attack action
export const attack = async (res: Response, req: Request) => {
    const duelId = req.params.duel_id;
    const duel = duels[duelId];
    if (!duel) res.status(404).json({ message: 'Duel not found' });
    if (isDuelTimedOut(duel)) return res.status(400).json({ message: 'Duel time out.' });

    const damage = 10;
    if (duel.turn === 'challenger') {
        duel.opponentHealth -= damage;
        duel.turn = 'opponent';
    }
    else {
        duel.challengerHealth -= damage;
        duel.turn = 'challenger';
    }
    res.json({ duel });

}

export const castSpell = async (req: Request, res: Response) => {
    const duelId = req.params.duel_id;
    const duel = duels[duelId];

    if (!duel) return res.status(404).json({ message: 'Duel not found.' });
    if (isDuelTimedOut(duel)) return res.status(400).json({ message: 'Duel timed out.' });

    const damage = 20;
    if (duel.turn === 'challenger') {
        duel.opponentHealth -= damage;
        duel.turn = 'opponent';
    }
    else {
        duel.challengerHealth -= damage;
        duel.turn = 'challenger';
    }
    res.json({ duel });
}

export const heal = async (req: Request, res: Response) => {
    const duelId = req.params.duel_id;
    const duel = duels[duelId];
    if (!duel) return res.status(404).json({ message: 'Duel not found.' });
    if (isDuelTimedOut(duel)) return res.status(400).json({ message: 'Duel timed out.' });

    // Simplified healing: heal = 15 (example: based on faith)
    const healAmount = 15;
    if (duel.turn === 'challenger') {
        duel.challengerHealth += healAmount;
        duel.turn = 'opponent';
    } else {
        duel.opponentHealth += healAmount;
        duel.turn = 'challenger';
    }
    res.json({ duel });
}

