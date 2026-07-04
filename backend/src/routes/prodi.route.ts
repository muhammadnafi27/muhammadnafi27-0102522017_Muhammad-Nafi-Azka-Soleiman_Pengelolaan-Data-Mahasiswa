import { Router } from 'express';
import { getProdi } from '../controllers/prodi.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, getProdi);

export default router;
