import { Router } from 'express';
import { getMahasiswas, createMahasiswa, updateMahasiswa, deleteMahasiswa } from '../controllers/mahasiswa.controller';
import uploadFotoMahasiswa from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getMahasiswas);
router.post('/', uploadFotoMahasiswa.single('foto'), createMahasiswa);
router.put('/:id', uploadFotoMahasiswa.single('foto'), updateMahasiswa);
router.delete('/:id', deleteMahasiswa);

export default router;
