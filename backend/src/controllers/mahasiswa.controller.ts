import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import pool from '../config/database';

export const getMahasiswas = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search).trim() : '';
    const prodiId = req.query.prodi_id ? String(req.query.prodi_id) : '';
    const parsedPage = parseInt(String(req.query.page), 10);
    const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const parsedLimit = parseInt(String(req.query.limit), 10);
    const limit = isNaN(parsedLimit) ? 10 : Math.max(1, parsedLimit);
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM mahasiswa m
      JOIN prodi p ON m.prodi_id = p.id
      WHERE (m.nim LIKE ? OR m.nama LIKE ?)
    `;
    const params: any[] = [`%${search}%`, `%${search}%`];

    if (prodiId) {
      baseQuery += ` AND m.prodi_id = ?`;
      params.push(parseInt(prodiId, 10));
    }

    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const [countRows] = await pool.query(countQuery, params);
    const total = (countRows as any)[0].total;

    const angkatanQuery = `SELECT COUNT(DISTINCT m.angkatan) as totalAngkatan ${baseQuery}`;
    const [angkatanRows] = await pool.query(angkatanQuery, params);
    const totalAngkatan = (angkatanRows as any)[0].totalAngkatan;

    const dataQuery = `
      SELECT m.id, m.nim, m.nama, m.prodi_id, p.nama_prodi, m.angkatan, m.foto, m.created_at, m.updated_at
      ${baseQuery}
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(dataQuery, [...params, limit, offset]);

    res.json({
      message: "Data mahasiswa berhasil diambil",
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit) || 1,
        totalAngkatan
      },
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const createMahasiswa = async (req: Request, res: Response): Promise<void> => {
  const { nim, nama, prodi_id, angkatan } = req.body;
  const foto = req.file ? req.file.filename : null;

  const nimClean = nim ? String(nim).trim() : '';
  const namaClean = nama ? String(nama).trim() : '';

  if (!nimClean || !namaClean || !prodi_id || !angkatan || isNaN(Number(angkatan))) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: "Semua field (nim, nama, prodi_id, angkatan) wajib diisi dengan format yang benar" });
    return;
  }

  try {
    // Cek persis duplikasi NIM
    const [existing] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ?', [nimClean]);
    if ((existing as any[]).length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(400).json({ message: "NIM tidak boleh duplikat (NIM ini sudah terdaftar)" });
      return;
    }

    const [result] = await pool.query(
      'INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES (?, ?, ?, ?, ?)',
      [nimClean, namaClean, Number(prodi_id), Number(angkatan), foto]
    );

    const insertId = (result as any).insertId;
    const [newData] = await pool.query(
      `SELECT m.id, m.nim, m.nama, m.prodi_id, p.nama_prodi, m.angkatan, m.foto, m.created_at, m.updated_at
       FROM mahasiswa m
       JOIN prodi p ON m.prodi_id = p.id
       WHERE m.id = ?`,
      [insertId]
    );

    res.status(201).json({
      message: "Data mahasiswa berhasil ditambahkan",
      data: (newData as any[])[0]
    });
  } catch (error: any) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: "NIM tidak boleh duplikat (NIM ini sudah terdaftar)" });
      return;
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const updateMahasiswa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nim, nama, prodi_id, angkatan, removeFoto } = req.body;
  const newFoto = req.file ? req.file.filename : undefined;

  const nimClean = nim ? String(nim).trim() : '';
  const namaClean = nama ? String(nama).trim() : '';

  if (!nimClean || !namaClean || !prodi_id || !angkatan || isNaN(Number(angkatan))) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: "Semua field (nim, nama, prodi_id, angkatan) wajib diisi dengan format yang benar" });
    return;
  }

  try {
    const [current] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
    if ((current as any[]).length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
      return;
    }

    const [existing] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ? AND id != ?', [nimClean, id]);
    if ((existing as any[]).length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(400).json({ message: "NIM tidak boleh duplikat (NIM ini sudah digunakan mahasiswa lain)" });
      return;
    }

    const oldFoto = (current as any[])[0].foto;
    let updateQuery = 'UPDATE mahasiswa SET nim = ?, nama = ?, prodi_id = ?, angkatan = ?';
    const params: any[] = [nimClean, namaClean, Number(prodi_id), Number(angkatan)];

    if (newFoto !== undefined) {
      updateQuery += ', foto = ?';
      params.push(newFoto);

      if (oldFoto) {
        const oldFotoPath = path.join(__dirname, '../../uploads/mahasiswa', oldFoto);
        if (fs.existsSync(oldFotoPath)) fs.unlinkSync(oldFotoPath);
      }
    } else if (removeFoto === 'true') {
      updateQuery += ', foto = NULL';
      if (oldFoto) {
        const oldFotoPath = path.join(__dirname, '../../uploads/mahasiswa', oldFoto);
        if (fs.existsSync(oldFotoPath)) fs.unlinkSync(oldFotoPath);
      }
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await pool.query(updateQuery, params);

    const [updatedData] = await pool.query(
      `SELECT m.id, m.nim, m.nama, m.prodi_id, p.nama_prodi, m.angkatan, m.foto, m.created_at, m.updated_at
       FROM mahasiswa m
       JOIN prodi p ON m.prodi_id = p.id
       WHERE m.id = ?`,
      [id]
    );

    res.json({
      message: "Data mahasiswa berhasil diperbarui",
      data: (updatedData as any[])[0]
    });
  } catch (error) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const deleteMahasiswa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [current] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
    if ((current as any[]).length === 0) {
      res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
      return;
    }

    const oldFoto = (current as any[])[0].foto;

    await pool.query('DELETE FROM mahasiswa WHERE id = ?', [id]);

    if (oldFoto) {
      const oldFotoPath = path.join(__dirname, '../../uploads/mahasiswa', oldFoto);
      if (fs.existsSync(oldFotoPath)) fs.unlinkSync(oldFotoPath);
    }

    res.json({ message: "Data mahasiswa berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
