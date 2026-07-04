import { Router } from 'express';
import { getMahasiswas, createMahasiswa, updateMahasiswa, deleteMahasiswa } from '../controllers/mahasiswa.controller';
import uploadFotoMahasiswa from '../middlewares/upload.middleware';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, authorizeRoles('admin', 'operator', 'viewer'), getMahasiswas);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'operator', 'viewer'), getMahasiswas);
router.post('/', authenticateJWT, authorizeRoles('admin', 'operator'), uploadFotoMahasiswa.single('foto'), createMahasiswa);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'operator'), uploadFotoMahasiswa.single('foto'), updateMahasiswa);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteMahasiswa);

export default router;
