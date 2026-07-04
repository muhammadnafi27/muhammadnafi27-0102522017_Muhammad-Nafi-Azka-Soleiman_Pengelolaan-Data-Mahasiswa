import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

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
      'INSERT INTO users (nama_lengkap, nim, email, prodi_id, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_lengkap, nim, email, prodi_id || null, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: result.insertId,
        nama_lengkap,
        nim,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body; // username represents either email or NIM

    if (!username || !password) {
      res.status(400).json({ message: 'Email/NIM dan password wajib diisi' });
      return;
    }

    // Query user where email = username OR nim = username
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? OR nim = ?',
      [username, username]
    );
    
    if (users.length === 0) {
      res.status(401).json({ message: 'Email/NIM atau password salah' });
      return;
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email/NIM atau password salah' });
      return;
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        nama_lengkap: user.nama_lengkap, 
        nim: user.nim, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        nim: user.nim,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
