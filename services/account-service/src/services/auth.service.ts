import { User } from '../models/user.model';
import UserRepository from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {

    async registerUser(username: string, password: string, role: 'User' | 'GameMaster' = 'User'): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser(username, hashedPassword, role);
        return newUser;
    }

    async loginUser(username: string, password: string): Promise<string | null> {
        const user = await UserRepository.findUserByUsername(username);
        if (!user)
            return null;
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.info(`isValid password`, isValidPassword);
        if (user && isValidPassword) {
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );
            console.info(`token: ${token}`);
            return token;
        }
        return null;
    }
}