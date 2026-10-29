import { Router } from 'express';
import { getHealthRecords, createHealthRecord } from '../controllers/recordController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getHealthRecords);
router.post('/', requireRole('doctor', 'admin'), createHealthRecord);

export default router;
