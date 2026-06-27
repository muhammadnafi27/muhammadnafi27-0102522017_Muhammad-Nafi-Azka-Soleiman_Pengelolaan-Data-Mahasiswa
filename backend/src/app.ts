import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';

import prodiRoutes from './routes/prodi.route';
import mahasiswaRoutes from './routes/mahasiswa.route';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Serve static uploads
// Dengan ini, URL foto http://localhost:3000/uploads/mahasiswa/nama-file.jpg bisa diakses
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/prodi', prodiRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer Error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
  next();
});

export default app;
