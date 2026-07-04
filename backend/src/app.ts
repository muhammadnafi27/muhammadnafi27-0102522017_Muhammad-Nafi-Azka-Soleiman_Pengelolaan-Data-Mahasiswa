import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';

import authRoutes from './routes/auth.route';
import prodiRoutes from './routes/prodi.route';
import mahasiswaRoutes from './routes/mahasiswa.route';
import usersRoutes from './routes/users.route';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow serving images to frontend

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { message: 'Terlalu banyak permintaan, silakan coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '10mb' }));

// Serve static uploads
// Dengan ini, URL foto http://localhost:3000/uploads/mahasiswa/nama-file.jpg bisa diakses
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prodi', prodiRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/users', usersRoutes);

// 404 Route Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
  next();
});

export default app;
