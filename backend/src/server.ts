import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.get('/api/mahasiswa', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mahasiswa ORDER BY created_at DESC');
    res.json({
      message: "Data mahasiswa berhasil diambil",
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

app.post('/api/mahasiswa', async (req: Request, res: Response): Promise<any> => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim) return res.status(400).json({ message: "nim wajib diisi" });
  if (!nama) return res.status(400).json({ message: "nama wajib diisi" });
  if (!prodi) return res.status(400).json({ message: "prodi wajib diisi" });
  if (!angkatan || isNaN(Number(angkatan))) return res.status(400).json({ message: "angkatan wajib angka" });

  try {
    const [existing] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);
    if ((existing as any[]).length > 0) {
      return res.status(400).json({ message: "nim tidak boleh duplikat" });
    }

    const [result] = await pool.query(
      'INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)',
      [nim, nama, prodi, Number(angkatan)]
    );

    const insertId = (result as any).insertId;
    const [newData] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [insertId]);

    res.status(201).json({
      message: "Data mahasiswa berhasil ditambahkan",
      data: (newData as any[])[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

app.put('/api/mahasiswa/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim) return res.status(400).json({ message: "nim wajib diisi" });
  if (!nama) return res.status(400).json({ message: "nama wajib diisi" });
  if (!prodi) return res.status(400).json({ message: "prodi wajib diisi" });
  if (!angkatan || isNaN(Number(angkatan))) return res.status(400).json({ message: "angkatan wajib angka" });

  try {
    const [existing] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ? AND id != ?', [nim, id]);
    if ((existing as any[]).length > 0) {
      return res.status(400).json({ message: "nim tidak boleh duplikat" });
    }

    await pool.query(
      'UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?',
      [nim, nama, prodi, Number(angkatan), id]
    );

    res.json({
      message: "Data mahasiswa berhasil diperbarui"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

app.delete('/api/mahasiswa/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM mahasiswa WHERE id = ?', [id]);
    res.json({
      message: "Data mahasiswa berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
