import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export type UserRole = "admin" | "operator" | "viewer";

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const JWT_SECRET = ENV.JWT_SECRET;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    return;
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Format token tidak valid' });
    return;
  }

  const token = authHeader.substring(7);
  if (!token) {
    res.status(401).json({ success: false, message: 'Format token tidak valid' });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).json({ success: false, message: 'Internal server error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded || typeof decoded !== 'object') {
      res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
      return;
    }

    if (
      typeof decoded.id !== 'number' || 
      typeof decoded.email !== 'string' || 
      !(decoded.role === 'admin' || decoded.role === 'operator' || decoded.role === 'viewer')
    ) {
      res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRole
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
  }
};
