import { Response } from 'express';
import { localStore } from '../db/index.js';
import { AuthenticatedRequest, AuditLog, User } from '../types/index.js';

export async function getTelemetry(req: AuthenticatedRequest, res: Response) {
  try {
    const store = localStore.get();
    const users: User[] = store.users || [];
    const appointments = store.appointments || [];
    const medicines = store.medicines || [];

    const totalPatients = users.filter(u => u.role === 'patient').length;
    const totalDoctors = users.filter(u => u.role === 'doctor').length;
    const totalPharmacies = users.filter(u => u.role === 'pharmacy').length;

    const totalConsultations = appointments.filter((a: any) => a.status === 'COMPLETED').length;
    const pendingConsultations = appointments.filter((a: any) => a.status === 'REQUESTED').length;
    const confirmedConsultations = appointments.filter((a: any) => a.status === 'CONFIRMED').length;

    const totalMedicinesCount = medicines.length;
    const inStockCount = medicines.filter((m: any) => m.stock > 0).length;
    const outOfStockCount = medicines.filter((m: any) => m.stock === 0).length;
    const lowStockCount = medicines.filter((m: any) => m.stock > 0 && m.stock < (m.minStock || 20)).length;

    return res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalPharmacies,
        totalConsultations,
        pendingConsultations,
        confirmedConsultations,
        totalMedicinesCount,
        inStockCount,
        outOfStockCount,
        lowStockCount,
        serverTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('getTelemetry error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve telemetry data' });
  }
}

export async function getAuditLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const store = localStore.get();
    const logs: AuditLog[] = store.auditLogs || [];

    return res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('getAuditLogs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs' });
  }
}

export async function getUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const store = localStore.get();
    const users: User[] = (store.users || []).map((u: any) => {
      const { password: _, ...rest } = u;
      return rest;
    });

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
}
