import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import pool from '../config/database';

const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid").max(100),
  password: z.string().min(6, "Password minimal 6 karakter").max(255)
});

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi")
});

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsedData = registerSchema.parse(req.body);
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [parsedData.email]);
    if ((existing as any[]).length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [parsedData.name, parsedData.email, hashedPassword, 'viewer']
    );

    const insertId = (result as any).insertId;
    const [newData] = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [insertId]
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      data: (newData as any[])[0]
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: (error as any).errors[0].message });
    }
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [parsedData.email]);
    const user = (users as any[])[0];

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(parsedData.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '2h') as any
    });

    res.json({
      message: "Login berhasil",
      data: {
        token,
        user: payload
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: (error as any).errors[0].message });
    }
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
