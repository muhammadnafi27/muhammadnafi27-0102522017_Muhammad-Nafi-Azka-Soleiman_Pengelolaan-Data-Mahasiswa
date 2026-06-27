import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from './db';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Serve uploads folder static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
  fileFilter: (req: any, file: any, cb: any) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (.jpeg, .jpg, .png, .webp) are allowed!"));
  }
});

// GET /api/prodi
app.get('/api/prodi', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prodi ORDER BY nama_prodi ASC');
    res.json({
      message: "Data prodi berhasil diambil",
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// GET /api/mahasiswa with search, filter prodi, and pagination
app.get('/api/mahasiswa', async (req: Request, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search).trim() : '';
    const prodiId = req.query.prodi_id ? String(req.query.prodi_id) : '';
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.max(1, parseInt(String(req.query.limit || '10'), 10));
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

    // Get total count
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const [countRows] = await pool.query(countQuery, params);
    const total = (countRows as any)[0].total;

    // Get paginated rows
    const dataQuery = `
      SELECT m.id, m.nim, m.nama, m.prodi_id, p.nama_prodi, m.angkatan, m.foto, m.created_at, m.updated_at
      ${baseQuery}
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    // MySQL query requires limit and offset to be numbers or it will throw syntax errors if passed as strings in some drivers
    const [rows] = await pool.query(dataQuery, [...params, limit, offset]);

    res.json({
      message: "Data mahasiswa berhasil diambil",
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// POST /api/mahasiswa with photo upload
app.post('/api/mahasiswa', upload.single('foto'), async (req: any, res: Response): Promise<any> => {
  const { nim, nama, prodi_id, angkatan } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!nim) return res.status(400).json({ message: "nim wajib diisi" });
  if (!nama) return res.status(400).json({ message: "nama wajib diisi" });
  if (!prodi_id) return res.status(400).json({ message: "prodi_id wajib diisi" });
  if (!angkatan || isNaN(Number(angkatan))) return res.status(400).json({ message: "angkatan wajib angka" });

  try {
    const [existing] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);
    if ((existing as any[]).length > 0) {
      // Clean up uploaded file if NIM is duplicate
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "nim tidak boleh duplikat" });
    }

    const [result] = await pool.query(
      'INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES (?, ?, ?, ?, ?)',
      [nim, nama, Number(prodi_id), Number(angkatan), foto]
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
  } catch (error) {
    console.error(error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// PUT /api/mahasiswa/:id with photo upload support
app.put('/api/mahasiswa/:id', upload.single('foto'), async (req: any, res: Response): Promise<any> => {
  const { id } = req.params;
  const { nim, nama, prodi_id, angkatan } = req.body;
  const newFoto = req.file ? req.file.filename : undefined;

  if (!nim) return res.status(400).json({ message: "nim wajib diisi" });
  if (!nama) return res.status(400).json({ message: "nama wajib diisi" });
  if (!prodi_id) return res.status(400).json({ message: "prodi_id wajib diisi" });
  if (!angkatan || isNaN(Number(angkatan))) return res.status(400).json({ message: "angkatan wajib angka" });

  try {
    const [current] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
    if ((current as any[]).length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    }

    const [existing] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ? AND id != ?', [nim, id]);
    if ((existing as any[]).length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "nim tidak boleh duplikat" });
    }

    const oldFoto = (current as any[])[0].foto;

    let updateQuery = 'UPDATE mahasiswa SET nim = ?, nama = ?, prodi_id = ?, angkatan = ?';
    const params: any[] = [nim, nama, Number(prodi_id), Number(angkatan)];

    if (newFoto !== undefined) {
      updateQuery += ', foto = ?';
      params.push(newFoto);

      // Delete old photo file if it exists
      if (oldFoto) {
        const oldFotoPath = path.join(__dirname, '../uploads', oldFoto);
        if (fs.existsSync(oldFotoPath)) {
          fs.unlinkSync(oldFotoPath);
        }
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
});

// DELETE /api/mahasiswa/:id
app.delete('/api/mahasiswa/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const [current] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
    if ((current as any[]).length === 0) {
      return res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    }

    const oldFoto = (current as any[])[0].foto;

    // Delete database record
    await pool.query('DELETE FROM mahasiswa WHERE id = ?', [id]);

    // Delete photo file if exists
    if (oldFoto) {
      const oldFotoPath = path.join(__dirname, '../uploads', oldFoto);
      if (fs.existsSync(oldFotoPath)) {
        fs.unlinkSync(oldFotoPath);
      }
    }

    res.json({
      message: "Data mahasiswa berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// Error handling middleware for Multer errors
app.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer Error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
