import { Router } from 'express';
import { getProdi } from '../controllers/prodi.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getProdi);

export default router;
