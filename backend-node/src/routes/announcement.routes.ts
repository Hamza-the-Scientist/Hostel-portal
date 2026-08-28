import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', AnnouncementController.getPublicAnnouncements);
router.get('/all', authenticateJWT, requireRole('Admin', 'SuperAdmin'), AnnouncementController.getAllAnnouncements);
router.post('/', authenticateJWT, requireRole('Admin', 'SuperAdmin'), AnnouncementController.createAnnouncement);
router.put('/:id', authenticateJWT, requireRole('Admin', 'SuperAdmin'), AnnouncementController.updateAnnouncement);
router.delete('/:id', authenticateJWT, requireRole('Admin', 'SuperAdmin'), AnnouncementController.deleteAnnouncement);

export default router;
