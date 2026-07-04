import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type AuthUser = {
  id: number;
  email: string;
  nim: string;
  role: "admin" | "operator" | "viewer";
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    return;
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Format token tidak valid' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
      return;
    }

    if (!decoded || typeof decoded !== 'object') {
      res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
      return;
    }

    const payload = decoded as any;
    const id = payload.id || payload.sub;

    if (!id || !payload.email || !payload.nim || !payload.role) {
      res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
      return;
    }

    if (!['admin', 'operator', 'viewer'].includes(payload.role)) {
      res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
      return;
    }

    req.user = {
      id: Number(id),
      email: payload.email,
      nim: payload.nim,
      role: payload.role as "admin" | "operator" | "viewer"
    };

    next();
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Anda tidak memiliki izin untuk mengakses fitur ini' });
      return;
    }
    next();
  };
};
