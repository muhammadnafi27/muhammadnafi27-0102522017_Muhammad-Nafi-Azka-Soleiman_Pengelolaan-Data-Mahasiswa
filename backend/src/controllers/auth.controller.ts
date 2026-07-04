import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middlewares/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nama_lengkap, nim, email, prodi_id, password } = req.body;

    if (!nama_lengkap || !nim || !email || !password) {
      res.status(400).json({ message: 'Semua field wajib diisi' });
      return;
    }

    // Check if email or nim already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR nim = ?',
      [email, nim]
    );
    
    if (existingUsers.length > 0) {
      res.status(409).json({ message: 'Email atau NIM sudah terdaftar' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, nama_lengkap, nim, email, prodi_id, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama_lengkap, nama_lengkap, nim, email, prodi_id || null, hashedPassword, 'viewer']
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: result.insertId,
        nama_lengkap,
        nim,
        email,
        role: 'viewer'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: 'Email dan password wajib diisi' });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({ message: 'Format email tidak valid' });
      return;
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1',
      [trimmedEmail]
    );
    
    if (users.length === 0) {
      res.status(401).json({ message: 'Email atau password salah' });
      return;
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email atau password salah' });
      return;
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '2h';
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Sesi tidak valid' });
      return;
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (users.length === 0) {
      res.status(401).json({ message: 'User tidak ditemukan atau sesi kadaluarsa' });
      return;
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logout berhasil'
  });
};
