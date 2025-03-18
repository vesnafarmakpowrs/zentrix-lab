// This file exports shared types and interfaces used across services.

export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
}

export interface Character {
    id: string;
    name: string;
    health: number;
    mana: number;
    createdBy: string;
}

export interface Combat {
    duelId: string;
    attackerId: string;
    defenderId: string;
    actions: string[];
}