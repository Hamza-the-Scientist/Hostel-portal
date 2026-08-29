import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { EligibilityController } from '../controllers/eligibility.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('Admin', 'SuperAdmin', 'Provost', 'Warden'));

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/allocation/status', AdminController.getAllocationStatus);
router.put('/allocation/status', AdminController.setAllocationStatus);
router.get('/students', AdminController.getStudents);
router.get('/districts', EligibilityController.getDistrictsManagement);
router.put('/districts/:id/status', EligibilityController.updateDistrictStatus);

router.get('/hostels', AdminController.getHostels);
router.post('/hostels', AdminController.createHostel);
router.put('/hostels/:id', AdminController.updateHostel);
router.delete('/hostels/:id', AdminController.deleteHostel);

export default router;
