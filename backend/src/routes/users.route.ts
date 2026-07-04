import { Router } from 'express';
import { getUsers, updateUserRole } from '../controllers/users.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Hanya admin yang bisa mengakses route ini
router.get('/', authenticateJWT, authorizeRoles('admin'), getUsers);
router.patch('/:id/role', authenticateJWT, authorizeRoles('admin'), updateUserRole);

export default router;
