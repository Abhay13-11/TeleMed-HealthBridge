import { Request } from 'express';

export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'admin';

export type AppointmentStatus = 
  | 'REQUESTED' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'FAILED' 
  | 'RESCHEDULED';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  location?: string;
  specialization?: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'in-person' | 'phone';
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  auditLog?: AppointmentAuditEntry[];
}

export interface AppointmentAuditEntry {
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  details?: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  title: string;
  type: string;
  date: string;
  status: 'ready' | 'pending' | 'processing';
  fileSize: string;
  summary: string;
  notes?: string;
  prescriptionDetails?: string;
  createdAt: string;
  createdBy: string;
}

export interface MedicineStock {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  stock: number;
  minStock: number;
  maxStock: number;
  price: number;
  mrp: number;
  manufacturer: string;
  batchNumber: string;
  rackNumber?: string;
  expiryDate: string;
  requiresPrescription: boolean;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'appointment' | 'record' | 'inventory' | 'auth' | 'system';
  entityId?: string;
  details?: string;
}
