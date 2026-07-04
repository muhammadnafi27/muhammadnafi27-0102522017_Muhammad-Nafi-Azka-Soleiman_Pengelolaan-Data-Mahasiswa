import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const dir = path.join(__dirname, '../../uploads/mahasiswa');
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

const uploadFotoMahasiswa = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // limit file size to 2MB
  fileFilter: (req: any, file: any, cb: any) => {
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
