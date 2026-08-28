import { Router } from 'express';
import { HostelController } from '../controllers/hostel.controller';

const router = Router();

router.get('/', HostelController.getPublicHostels);
router.get('/:id', HostelController.getPublicHostelById);

export default router;
