import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const allowRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User belum login' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Anda tidak memiliki akses ke fitur ini' });
      return;
    }

    next();
  };
};
