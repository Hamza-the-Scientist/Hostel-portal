import { Router } from 'express';
import { EligibilityController } from '../controllers/eligibility.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('Admin', 'SuperAdmin'));

router.get('/districts', EligibilityController.getDistricts);
router.get('/campuses', EligibilityController.getCampuses);
router.get('/hostel/:hostelId', EligibilityController.getRulesByHostel);
router.post('/', EligibilityController.createRule);
router.put('/:id', EligibilityController.updateRule);
router.delete('/:id', EligibilityController.deleteRule);

export default router;
