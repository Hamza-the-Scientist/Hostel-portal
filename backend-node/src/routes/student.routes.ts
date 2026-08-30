import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/profile', requireRole('Student'), StudentController.getProfile);
router.put('/profile', requireRole('Student'), StudentController.updateProfile);
router.get('/eligibility-status', requireRole('Student'), StudentController.getDistrictEligibility);
router.get('/application', requireRole('Student'), StudentController.getApplication);
router.post('/application', requireRole('Student'), StudentController.submitApplication);
router.get('/merit-result', requireRole('Student'), StudentController.getMeritResult);

export default router;
