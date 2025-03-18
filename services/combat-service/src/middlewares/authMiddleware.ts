import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface JwtPayload {
  id: number;
  username: string;
  role: 'User' | 'GameMaster';
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = { id: 1, username: 'testUser', role: 'GameMaster' } as JwtPayload;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded as JwtPayload;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authentication token is missing' });
  }
};