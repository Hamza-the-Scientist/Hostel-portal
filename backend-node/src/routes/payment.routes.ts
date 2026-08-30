import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/challans', requireRole('Student'), StudentController.getChallans);

export default router;
