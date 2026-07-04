import { Router } from 'express';
import { getProdi } from '../controllers/prodi.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getProdi);

export default router;
