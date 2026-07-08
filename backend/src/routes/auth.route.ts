import { Router } from 'express';
import { login, register, getCurrentUser, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getCurrentUser);

// Tugas 15 Mingguan (Opsional: Forgot Password)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
