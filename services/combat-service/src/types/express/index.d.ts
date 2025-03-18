import { JwtPayload } from '../../middlewares/authMiddleware'; 

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}