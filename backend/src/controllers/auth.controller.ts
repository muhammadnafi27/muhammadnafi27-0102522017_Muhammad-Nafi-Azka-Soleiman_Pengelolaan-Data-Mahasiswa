import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username dan password wajib diisi' });
      return;
    }

    const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      res.status(409).json({ message: 'Username sudah digunakan' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: result.insertId,
        username,
        role: 'user'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username dan password wajib diisi' });
      return;
    }

    const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      res.status(401).json({ message: 'Username atau password salah' });
      return;
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Username atau password salah' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
