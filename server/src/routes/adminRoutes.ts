import { Router } from 'express';
import { getTelemetry, getAuditLogs, getUsers } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/telemetry', getTelemetry);
router.get('/audit-logs', getAuditLogs);
router.get('/users', getUsers);

export default router;
