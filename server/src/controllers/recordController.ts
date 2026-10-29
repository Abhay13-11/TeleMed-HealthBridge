import { Response } from 'express';
import { z } from 'zod';
import { localStore } from '../db/index.js';
import { AuthenticatedRequest, HealthRecord } from '../types/index.js';

const CreateRecordSchema = z.object({
  patientId: z.string().min(1, 'Patient ID required'),
  patientName: z.string().min(1, 'Patient name required'),
  title: z.string().min(3, 'Record title required'),
  type: z.string().min(2, 'Record type required'),
  date: z.string().min(1, 'Date required'),
  summary: z.string().min(5, 'Clinical summary required'),
  notes: z.string().optional(),
  prescriptionDetails: z.string().optional(),
  fileSize: z.string().default('500 KB'),
});

export async function getHealthRecords(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;
    const store = localStore.get();
    let records: HealthRecord[] = store.records || [];

    // Strict RBAC Data Isolation
    if (user.role === 'patient') {
      records = records.filter(r => r.patientId === user.id);
    } else if (user.role === 'doctor') {
      records = records.filter(r => r.doctorId === user.id);
    } // admin sees all

    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('getHealthRecords error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve medical records' });
  }
}

export async function createHealthRecord(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user!;

    // Anti-Forgery Guard: Only verified doctors or system administrators can write clinical health records
    if (!['doctor', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only registered healthcare providers can generate clinical records.'
      });
    }

    const parsed = CreateRecordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const store = localStore.get();
    const records: HealthRecord[] = store.records || [];

    const newRecord: HealthRecord = {
      id: `rec-${Date.now()}`,
      ...parsed.data,
      doctorId: user.id,
      doctorName: user.name,
      status: 'ready',
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    records.unshift(newRecord);
    store.records = records;

    // Log clinical audit event
    store.auditLogs = store.auditLogs || [];
    store.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'RECORD_CREATED',
      entityType: 'record',
      entityId: newRecord.id,
      details: `Clinical record "${newRecord.title}" issued for patient ${newRecord.patientName}`
    });

    localStore.save(store);

    return res.status(201).json({
      success: true,
      message: 'Health record created successfully',
      data: newRecord
    });
  } catch (error) {
    console.error('createHealthRecord error:', error);
    return res.status(500).json({ success: false, message: 'Failed to issue clinical record' });
  }
}
