import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  nim: z.string().trim().max(30, "NIM maksimal 30 karakter").regex(/^[A-Za-z0-9]+$/, "NIM hanya boleh berisi karakter alfanumerik"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid").max(100),
  programStudi: z.string().trim().min(1, "Program studi wajib diisi"),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter")
    .regex(/[a-zA-Z]/, "Password harus memiliki minimal satu huruf")
    .regex(/[0-9]/, "Password harus memiliki minimal satu angka")
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Identifier wajib diisi"),
  password: z.string().min(1, "Password wajib diisi")
});

export const register = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const parsedData = registerSchema.parse(req.body);
    
    // Validate email or NIM duplicate
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR nim = ?', 
      [parsedData.email, parsedData.nim]
    );
    if ((existing as unknown[]).length > 0) {
      return res.status(409).json({ success: false, message: "Email atau NIM sudah digunakan" });
    }

    // Lookup program studi
    const [prodiData] = await pool.query('SELECT id FROM prodi WHERE nama_prodi = ?', [parsedData.programStudi]);
    const prodi = (prodiData as { id: number }[])[0];
    if (!prodi) {
      return res.status(400).json({ success: false, message: "Program studi tidak ditemukan" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(parsedData.password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO users (name, nim, email, password, prodi_id, role) VALUES (?, ?, ?, ?, ?, ?)',
      [parsedData.name, parsedData.nim, parsedData.email, hashedPassword, prodi.id, 'viewer']
    );

    const insertId = (result as { insertId: number }).insertId;
    
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        user: {
          id: insertId,
          name: parsedData.name,
          nim: parsedData.nim,
          email: parsedData.email,
          programStudi: parsedData.programStudi,
          role: 'viewer'
        }
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

export const login = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const parsedData = loginSchema.parse(req.body);
    
    let identifier = parsedData.identifier;
    if (identifier.includes('@')) {
      identifier = identifier.toLowerCase();
    }

    const [users] = await pool.query(
      `SELECT u.id, u.name, u.nim, u.email, u.password, u.role, p.nama_prodi as programStudi 
       FROM users u 
       LEFT JOIN prodi p ON u.prodi_id = p.id 
       WHERE u.email = ? OR u.nim = ?`, 
      [identifier, identifier]
    );
    const user = (users as Record<string, unknown>[])[0];

    if (!user || typeof user.password !== 'string') {
      return res.status(401).json({ success: false, message: "Email, NIM, atau password salah" });
    }

    const isMatch = await bcrypt.compare(parsedData.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email, NIM, atau password salah" });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      nim: user.nim,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '2h') as jwt.SignOptions['expiresIn']
    });

    return res.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          nim: user.nim,
          email: user.email,
          programStudi: user.programStudi,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, message: error.issues[0].message });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void | Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau telah kedaluwarsa" });
    }

    const [users] = await pool.query(
      `SELECT u.id, u.name, u.nim, u.email, u.role, u.created_at as createdAt, u.updated_at as updatedAt, p.nama_prodi as programStudi 
       FROM users u 
       LEFT JOIN prodi p ON u.prodi_id = p.id 
       WHERE u.id = ?`, 
      [userId]
    );
    const user = (users as Record<string, unknown>[])[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau telah kedaluwarsa" });
    }

    return res.json({
      success: true,
      message: "Data user berhasil diambil",
      data: {
        user
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void | Response> => {
  return res.json({
    success: true,
    message: "Logout berhasil"
  });
};
