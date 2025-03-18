import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service'

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  try {
    const user = await authService.registerUser(username, password, role);
    res.status(201).json(user);
  }
  catch (error: any) {
      // Check for PostgreSQL unique constraint violation
      if (error.message.includes('duplicate key value')) {
        return res.status(400).json({ error: 'User already exists' });
      }
    return res.status(500).json({ error: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const token = await authService.loginUser(username, password);
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};