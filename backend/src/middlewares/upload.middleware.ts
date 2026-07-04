import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const dir = path.join(__dirname, '../../uploads/mahasiswa');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadFotoMahasiswa = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // limit file size to 2MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Hanya diperbolehkan format image (.jpeg, .jpg, .png, .webp)!"));
  }
});

export default uploadFotoMahasiswa;
