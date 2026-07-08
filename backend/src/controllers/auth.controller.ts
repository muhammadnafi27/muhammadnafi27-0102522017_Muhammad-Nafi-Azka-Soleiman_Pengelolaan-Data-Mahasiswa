import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ENV } from '../config/env';
import crypto from 'crypto';
import transporter from '../config/mail';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nama_lengkap, nim, email, prodi_id, password } = req.body;

    if (!nama_lengkap || !nim || !email || !password) {
      res.status(400).json({ message: 'Semua field wajib diisi' });
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

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, nama_lengkap, nim, email, prodi_id, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama_lengkap, nama_lengkap, nim, email, prodi_id || null, hashedPassword, 'viewer']
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: result.insertId,
        nama_lengkap,
        nim,
        email,
        role: 'viewer'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: 'Email dan password wajib diisi' });
      return;
    }

    const trimmedIdentifier = email.trim();
    const isEmail = trimmedIdentifier.includes('@');
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedIdentifier.toLowerCase())) {
        res.status(400).json({ message: 'Format email tidak valid' });
        return;
      }
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, password, role FROM users WHERE email = ? OR nim = ? LIMIT 1',
      [trimmedIdentifier.toLowerCase(), trimmedIdentifier]
    );
    
    if (users.length === 0) {
      res.status(401).json({ message: 'Email/NIM atau password salah' });
      return;
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email/NIM atau password salah' });
      return;
    }

    const expiresIn = ENV.JWT_EXPIRES_IN;
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      ENV.JWT_SECRET,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
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
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Sesi tidak valid' });
      return;
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (users.length === 0) {
      res.status(401).json({ message: 'User tidak ditemukan atau sesi kadaluarsa' });
      return;
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logout berhasil'
  });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email wajib diisi' });
      return;
    }

    // Cari user berdasarkan email
    const [users] = await pool.query<RowDataPacket[]>('SELECT id, name, email FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      const user = users[0];
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 menit

      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [user.id, tokenHash, expiresAt]
      );

      const appUrl = process.env.APP_URL || 'http://localhost:3001';
      const resetLink = `${appUrl}/reset-password?token=${rawToken}`;

      try {
        await transporter.sendMail({
          from: `"Pengelolaan Data Mahasiswa" <${process.env.MAIL_USER}>`,
          to: user.email,
          subject: 'Reset Password',
          html: `
            <h3>Halo ${user.name},</h3>
            <p>Anda meminta untuk mereset password akun Anda.</p>
            <p>Silakan klik link di bawah ini untuk mengatur ulang password Anda. Link ini hanya berlaku selama 30 menit.</p>
            <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <br/>
            <p>Terima kasih,</p>
            <p>Tim Pengelolaan Data Mahasiswa UAI</p>
          `
        });
      } catch (mailError) {
        console.error('Gagal mengirim email SMTP:', mailError);
        // Tetap kirim response sukses meski email gagal agar generic (atau bisa direturn 500 jika strictly required)
      }
    }

    // Response generik (Tugas 15 Mingguan)
    res.status(200).json({
      message: 'Jika email terdaftar, link reset password akan dikirim ke email tersebut.'
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      res.status(400).json({ message: 'Token dan password baru wajib diisi' });
      return;
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const [tokens] = await pool.query<RowDataPacket[]>(
      'SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1',
      [tokenHash]
    );

    if (tokens.length === 0) {
      res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa' });
      return;
    }

    const validToken = tokens[0];
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, validToken.user_id]);
    await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [validToken.id]);

    res.status(200).json({ message: 'Password berhasil diubah' });
  } catch (error) {
    next(error);
  }
};
