import { Request, Response } from 'express';
import pool from '../config/database';

export const getProdi = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT id, nama_prodi FROM prodi ORDER BY nama_prodi ASC');
    res.json({
      message: "Data prodi berhasil diambil",
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
