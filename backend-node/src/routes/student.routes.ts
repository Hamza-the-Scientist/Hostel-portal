import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/profile', requireRole('Student'), StudentController.getProfile);
router.put('/profile', requireRole('Student'), StudentController.updateProfile);

export default router;
