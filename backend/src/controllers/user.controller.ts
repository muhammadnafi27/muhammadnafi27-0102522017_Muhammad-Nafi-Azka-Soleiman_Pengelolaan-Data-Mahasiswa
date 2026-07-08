import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middlewares/auth.middleware';

const generateTemporaryPassword = (): string => {
  return crypto.randomBytes(5).toString('hex');
};

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
    );
    res.json({ message: 'Data user berhasil diambil', data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, nama_lengkap, nim } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Nama, email, password, dan role wajib diisi' });
      return;
    }

    if (!['admin', 'operator', 'viewer'].includes(role)) {
      res.status(400).json({ message: 'Role tidak valid' });
      return;
    }

    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({ message: 'Email sudah digunakan' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const finalNamaLengkap = nama_lengkap || name;
    const finalNim = nim || `U${Date.now()}`;

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, nama_lengkap, nim, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, finalNamaLengkap, finalNim, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      res.status(400).json({ message: 'Nama, email, dan role wajib diisi' });
      return;
    }

    if (!['admin', 'operator', 'viewer'].includes(role)) {
      res.status(400).json({ message: 'Role tidak valid' });
      return;
    }

    const [existingUser] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    const [existingEmails] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingEmails.length > 0) {
      res.status(409).json({ message: 'Email sudah digunakan' });
      return;
    }

    await pool.query<ResultSetHeader>(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );

    res.json({ message: 'User berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (parseInt(id as string, 10) === currentUserId) {
      res.status(400).json({ message: 'Admin tidak dapat menghapus akun sendiri' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const resetPasswordByAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const [existingUser] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    await pool.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    res.json({ 
      message: 'Password berhasil direset', 
      temporaryPassword: temporaryPassword,
      note: 'Tampilkan hanya sekali, lalu minta user mengganti password.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
