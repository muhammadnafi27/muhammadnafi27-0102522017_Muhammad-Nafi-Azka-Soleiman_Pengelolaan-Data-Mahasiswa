import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const jwtPayloadSchema = z.object({
  id: z.number().or(z.string().transform(Number)),
  email: z.string().email(),
  role: z.enum(['admin', 'operator', 'viewer']),
  iat: z.number().optional(),
  exp: z.number().optional()
});

export interface AuthenticatedRequest extends Request {
  user?: z.infer<typeof jwtPayloadSchema>;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
    }

    const parseResult = jwtPayloadSchema.safeParse(decoded);
    if (!parseResult.success) {
      return res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa' });
    }

    req.user = parseResult.data;
    next();
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki izin untuk mengakses fitur ini' });
    }
    next();
  };
};
