import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error: %o', err);
  res.status(500).json({ message: 'Internal server error' });
};
