import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, nama_lengkap, nim, email, prodi_id, role, created_at, updated_at FROM users'
    );
    res.json({ message: 'Data users berhasil diambil', data: users });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, nama_lengkap, nim, email, prodi_id, password, role } = req.body;

    if (!nama_lengkap || !nim || !email || !password) {
      res.status(400).json({ message: 'nama_lengkap, nim, email, dan password wajib diisi' });
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

    const _name = name || nama_lengkap;
    const _role = role || 'viewer';

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, nama_lengkap, nim, email, prodi_id, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [_name, nama_lengkap, nim, email, prodi_id || null, hashedPassword, _role]
    );

    res.status(201).json({
      message: 'User berhasil ditambahkan',
      data: {
        id: result.insertId,
        name: _name,
        nama_lengkap,
        email,
        role: _role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, nama_lengkap, email, role } = req.body;

    if (!nama_lengkap || !email) {
      res.status(400).json({ message: 'nama_lengkap dan email wajib diisi' });
      return;
    }

    // Validate if the new email belongs to someone else
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({ message: 'Email sudah terdaftar pada user lain' });
      return;
    }

    const _name = name || nama_lengkap;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET name = ?, nama_lengkap = ?, email = ?, role = ? WHERE id = ?',
      [_name, nama_lengkap, email, role, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    res.json({ message: 'Data user berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const idStr = Array.isArray(id) ? id[0] : id;
    if (parseInt(idStr, 10) === currentUserId) {
      res.status(403).json({ message: 'Admin tidak dapat menghapus akunnya sendiri' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUser] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    // Generate random 8 character string
    const temporaryPassword = crypto.randomBytes(4).toString('hex'); // 8 characters
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(temporaryPassword, saltRounds);

    await pool.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    res.json({ 
      message: 'Password user berhasil di-reset', 
      data: {
        temporaryPassword: temporaryPassword,
        note: 'Simpan password ini karena hanya ditampilkan satu kali.'
      }
    });
  } catch (error) {
    next(error);
  }
};
