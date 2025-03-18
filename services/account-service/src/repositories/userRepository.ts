import { Pool } from 'pg';
import { User } from '../models/user.model';
import path from 'path';
import dotenv from 'dotenv';
import logger from '../config/logger.config';

dotenv.config({
    path: path.resolve(__dirname, '../../../../.env')
});

logger.info(`User repository Env path file ${path.resolve(__dirname, '../../../../.env')}`);
logger.info(`User repository Database name ${process.env.ACCOUNT_DATABASE_NAME}`);

const pool = new Pool({
    connectionString: process.env.ACCOUNT_DATABASE_URL
});

export const createUser = async (username: string, password: string, role: 'User' | 'GameMaster' = 'User'): Promise<User> => {

    const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, password, role]
    );
    return result.rows[0];
};

export const findUserById = async (id: number): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows.length ? result.rows[0] : null;
};

const UserRepository = {
    createUser,
    findUserById,
    findUserByUsername,
};

export default UserRepository;
