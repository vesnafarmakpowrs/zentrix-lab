import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.config';

export interface JwtPayload {
    id: number;
    username: string;
    role: 'User' | 'GameMaster';
  }

  export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    logger.info('authenticating request');
    if (process.env.NODE_ENV === 'test' || 'development') {
      req.user = { id: 1, username: 'testUser', role: 'GameMaster' } as JwtPayload;
      return next();
    }
    logger.info('authenticating request not in test mode');
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        // Attach decoded token to req.user
        req.user = decoded as JwtPayload;
        next();
      });
    } else {
      res.status(401).json({ message: 'Authentication token is missing' });
    }
  }; 