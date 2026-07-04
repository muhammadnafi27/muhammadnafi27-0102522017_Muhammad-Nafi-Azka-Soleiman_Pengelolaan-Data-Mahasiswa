import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import pool from '../config/database';

const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid").max(100),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter")
    .regex(/[a-zA-Z]/, "Password harus memiliki minimal satu huruf")
    .regex(/[0-9]/, "Password harus memiliki minimal satu angka"),
  confirmPassword: z.string().optional()
}).refine(data => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi")
});

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsedData = registerSchema.parse(req.body);
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [parsedData.email]);
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ success: false, message: "Email sudah digunakan" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(parsedData.password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [parsedData.name, parsedData.email, hashedPassword, 'viewer']
    );

    const insertId = (result as any).insertId;
    
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        user: {
          id: insertId,
          name: parsedData.name,
          email: parsedData.email,
          role: 'viewer'
        }
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, message: (error as any).errors[0].message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [parsedData.email]);
    const user = (users as any[])[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(parsedData.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '2h') as any
    });

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, message: (error as any).errors[0].message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

export const me = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau telah kedaluwarsa" });
    }

    const [users] = await pool.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?', [userId]);
    const user = (users as any[])[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau telah kedaluwarsa" });
    }

    res.json({
      success: true,
      message: "Data user berhasil diambil",
      data: {
        user
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  res.json({
    success: true,
    message: "Logout berhasil"
  });
};
