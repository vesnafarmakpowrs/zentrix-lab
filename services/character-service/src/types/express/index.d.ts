declare global {
  namespace Express {
      interface Request {
          user?: {
              id: number;
              username: string;
              role: 'User' | 'GameMaster';
          }
      }
  }
}

export {};