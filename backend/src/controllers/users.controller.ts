import { Response } from 'express';
import pool from '../config/database';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void | Response> => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
  }
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const userReq = req.user;

    if (!userReq) {
      return res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
    }

    if (userReq.id === Number(id)) {
      return res.status(403).json({ success: false, message: 'Anda tidak dapat mengubah role Anda sendiri' });
    }

    const roleSchema = z.enum(['admin', 'operator', 'viewer']);
    const parseResult = roleSchema.safeParse(role);

    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Role tidak valid' });
    }

    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    return res.status(200).json({ success: true, message: 'Role user berhasil diubah' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengubah role user' });
  }
};
