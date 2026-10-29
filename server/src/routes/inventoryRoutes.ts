import { Router } from 'express';
import { getInventory, updateStock, addMedicine } from '../controllers/inventoryController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Publicly searchable inventory (rural patients checking medicine availability)
router.get('/', getInventory);

// Restricted stock management
router.patch('/:id/stock', authenticateToken, requireRole('pharmacy', 'admin'), updateStock);
router.post('/', authenticateToken, requireRole('pharmacy', 'admin'), addMedicine);

export default router;
