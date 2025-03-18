import { Request, Response, NextFunction } from 'express';

export const requireGameMaster = (req: Request, res: Response, next: NextFunction) => {
  console.info('authenticating requireGameMaster');
  if (req.user && req.user.role === 'GameMaster') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. GameMaster role required.' });
  }
};

