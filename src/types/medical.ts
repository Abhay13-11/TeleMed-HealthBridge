export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'RESCHEDULED'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface AuditRecord {
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  details?: string;
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
  symptoms?: string;
  notes?: string;
  rejectionReason?: string;
  rescheduleDate?: string;
  rescheduleTime?: string;
  createdAt: string;
  updatedAt: string;
  auditLog?: AuditRecord[];
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicines: Medicine[];
  notes: string;
  date: string;
  status: 'active' | 'completed';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface MedicineStock {
  id: string;
  pharmacyId: string;
  pharmacyName?: string;
  name: string;
  genericName?: string;
  category?: string;
  dosageForm?: string;
  strength?: string;
  stock: number;
  minStock?: number;
  maxStock?: number;
  price: number;
  mrp?: number;
  manufacturer: string;
  expiryDate: string;
  batchNumber?: string;
  rackNumber?: string;
  requiresPrescription?: boolean;
  lastUpdated?: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  title: string;
  type: 'Lab Test' | 'Radiology' | 'Cardiology' | 'General Consultation' | 'Prescription';
  date: string;
  status: 'ready' | 'pending';
  fileSize: string;
  summary: string;
  doctorNotes?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    spo2?: number;
  };
  medicines?: Medicine[];
  createdAt: string;
}

export interface SymptomCheck {
  fever: boolean;
  cough: boolean;
  headache: boolean;
  bodyPain: boolean;
  nausea: boolean;
  fatigue: boolean;
  other: string;
}

export interface AnalyticsData {
  totalConsultations: number;
  weeklyConsultations: Array<{ day: string; count: number }>;
  topMedicines: Array<{ name: string; requests: number }>;
  fulfillmentRate: number;
  activePatients: number;
  activeDoctors: number;
  totalPharmacies: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: string;
  title: string;
  message: string;
  type: 'appointment' | 'record' | 'inventory' | 'system' | 'emergency';
  read: boolean;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: string;
  timestamp: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  village: string;
  district: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  consentGiven: boolean;
  consentDate?: string;
}
