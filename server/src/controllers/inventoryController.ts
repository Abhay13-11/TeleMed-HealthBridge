import { Request, Response } from 'express';
import { z } from 'zod';
import { localStore } from '../db/index.js';
import { AuthenticatedRequest, MedicineStock } from '../types/index.js';

const UpdateStockSchema = z.object({
  quantity: z.number(),
  mode: z.enum(['set', 'adjust']),
});

const AddMedicineSchema = z.object({
  name: z.string().min(2, 'Medicine name required'),
  genericName: z.string().min(2, 'Generic name required'),
  category: z.string().min(2, 'Category required'),
  dosageForm: z.string().min(1, 'Dosage form required'),
  strength: z.string().min(1, 'Strength required'),
  stock: z.number().min(0, 'Initial stock cannot be negative'),
  minStock: z.number().default(20),
  maxStock: z.number().default(500),
  price: z.number().min(0, 'Price must be positive'),
  mrp: z.number().min(0, 'MRP must be positive'),
  manufacturer: z.string().min(2, 'Manufacturer required'),
  batchNumber: z.string().min(2, 'Batch number required'),
  expiryDate: z.string().min(4, 'Expiry date required'),
  requiresPrescription: z.boolean().default(false),
  rackNumber: z.string().optional(),
});

export async function getInventory(req: Request, res: Response) {
  try {
    const { query, pharmacyId } = req.query;
    const store = localStore.get();
    let list: MedicineStock[] = store.medicines || [];

    if (pharmacyId && typeof pharmacyId === 'string') {
      list = list.filter(m => m.pharmacyId === pharmacyId);
    }

    if (query && typeof query === 'string' && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('getInventory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve medicine inventory' });
  }
}

export async function updateStock(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;
    const { id } = req.params;

    if (!['pharmacy', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only registered pharmacists can update medication stock.'
      });
    }

    const parsed = UpdateStockSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const { quantity, mode } = parsed.data;
    const store = localStore.get();
    const medicines: MedicineStock[] = store.medicines || [];

    const index = medicines.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    const med = medicines[index];
    const newStock = mode === 'set' ? Math.max(0, quantity) : Math.max(0, med.stock + quantity);

    const updated: MedicineStock = {
      ...med,
      stock: newStock,
      lastUpdated: new Date().toISOString()
    };

    medicines[index] = updated;
    store.medicines = medicines;

    // Log inventory audit event
    store.auditLogs = store.auditLogs || [];
    store.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'STOCK_UPDATED',
      entityType: 'inventory',
      entityId: med.id,
      details: `${med.name} stock updated from ${med.stock} to ${newStock} units (mode: ${mode})`
    });

    localStore.save(store);

    return res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('updateStock error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update stock quantity' });
  }
}

export async function addMedicine(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;

    if (!['pharmacy', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only registered pharmacists can add medicines to inventory.'
      });
    }

    const parsed = AddMedicineSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const store = localStore.get();
    const medicines: MedicineStock[] = store.medicines || [];

    const newMed: MedicineStock = {
      id: `stock-${Date.now()}`,
      pharmacyId: user.id,
      pharmacyName: user.name,
      ...parsed.data,
      lastUpdated: new Date().toISOString()
    };

    medicines.unshift(newMed);
    store.medicines = medicines;
    localStore.save(store);

    return res.status(201).json({
      success: true,
      message: 'Medicine added to inventory',
      data: newMed
    });
  } catch (error) {
    console.error('addMedicine error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add medicine' });
  }
}
