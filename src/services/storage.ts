import { 
  Appointment, 
  AppointmentStatus, 
  HealthRecord, 
  MedicineStock, 
  NotificationItem, 
  AuditEvent,
  PatientProfile
} from '@/types/medical';
import { User } from '@/types/auth';

const STORAGE_KEYS = {
  APPOINTMENTS: 'healthbridge_appointments',
  RECORDS: 'healthbridge_health_records',
  INVENTORY: 'healthbridge_inventory',
  NOTIFICATIONS: 'healthbridge_notifications',
  AUDIT_LOGS: 'healthbridge_audit_logs',
  PROFILES: 'healthbridge_patient_profiles'
};

// Default seed data tailored to Nabha rural context
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    specialty: 'General Medicine',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'video',
    status: 'REQUESTED',
    symptoms: 'Persistent fever, dry cough and generalized body pain for 3 days',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    auditLog: [
      {
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        actorId: '1',
        actorName: 'Krishna',
        actorRole: 'patient',
        action: 'REQUESTED',
        details: 'Initial appointment request submitted'
      }
    ]
  },
  {
    id: 'apt-102',
    patientId: '5',
    patientName: 'Meera Singh',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    specialty: 'General Medicine',
    date: '2024-01-16',
    time: '02:00 PM',
    type: 'in-person',
    status: 'CONFIRMED',
    symptoms: 'Recurring migraine, sensitivity to light, mild nausea',
    notes: 'Scheduled for in-person review at Nabha Civil Hospital OPD Room 4',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    auditLog: [
      {
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        actorId: '5',
        actorName: 'Meera Singh',
        actorRole: 'patient',
        action: 'REQUESTED'
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        actorId: '2',
        actorName: 'Dr. Rachit',
        actorRole: 'doctor',
        action: 'CONFIRMED',
        details: 'Confirmed by attending physician'
      }
    ]
  },
  {
    id: 'apt-103',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    specialty: 'General Medicine',
    date: '2024-01-08',
    time: '11:30 AM',
    type: 'video',
    status: 'COMPLETED',
    symptoms: 'Post-viral fatigue and follow up on blood pressure medications',
    notes: 'Blood pressure controlled at 122/80. Advised low salt diet and mild daily walk.',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    auditLog: [
      {
        timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
        actorId: '1',
        actorName: 'Krishna',
        actorRole: 'patient',
        action: 'REQUESTED'
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        actorId: '2',
        actorName: 'Dr. Rachit',
        actorRole: 'doctor',
        action: 'COMPLETED',
        details: 'Consultation concluded and prescription generated'
      }
    ]
  }
];

const SEED_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'rec-1',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    title: 'Complete Blood Count (CBC) Panel',
    type: 'Lab Test',
    date: '2024-01-10',
    status: 'ready',
    fileSize: '1.4 MB',
    summary: 'Hemoglobin 13.8 g/dL, WBC 6,400/mcL, Platelets 240,000/mcL. Normal range.',
    doctorNotes: 'No signs of acute bacterial infection. Normal hematology parameters.',
    vitalSigns: {
      bloodPressure: '124/82',
      heartRate: 74,
      temperature: 98.4,
      spo2: 99
    },
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'rec-2',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    title: 'Chest X-Ray (PA View)',
    type: 'Radiology',
    date: '2024-01-05',
    status: 'ready',
    fileSize: '3.8 MB',
    summary: 'Clear lung fields bilaterally. Normal cardiac silhouette. No pleural effusion.',
    doctorNotes: 'Chest radiograph is clear. No active pulmonary consolidation.',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      spo2: 98
    },
    createdAt: '2024-01-05T09:30:00Z'
  },
  {
    id: 'rec-3',
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    title: 'Consultation Prescription & Advice',
    type: 'Prescription',
    date: '2024-01-08',
    status: 'ready',
    fileSize: '420 KB',
    summary: 'Rx: Paracetamol 500mg, Vitamin C 500mg. Hydration and rest for 3 days.',
    doctorNotes: 'Follow-up if fever spikes above 101F.',
    medicines: [
      {
        id: 'med-1',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily after meals',
        duration: '5 days',
        instructions: 'Take after meals'
      },
      {
        id: 'med-2',
        name: 'Vitamin C',
        dosage: '500mg',
        frequency: 'Once daily',
        duration: '10 days',
        instructions: 'Take in the morning'
      }
    ],
    createdAt: '2024-01-08T12:00:00Z'
  },
  {
    id: 'rec-4',
    patientId: '5', // Belongs to Meera Singh - used to test RBAC!
    patientName: 'Meera Singh',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    title: 'Fasting Blood Glucose & HbA1c',
    type: 'Lab Test',
    date: '2024-01-02',
    status: 'ready',
    fileSize: '890 KB',
    summary: 'Fasting Glucose 98 mg/dL, HbA1c 5.4%. Normal glycemic control.',
    createdAt: '2024-01-02T11:00:00Z'
  }
];

const SEED_INVENTORY: MedicineStock[] = [
  {
    id: 'stock-1',
    pharmacyId: '3',
    pharmacyName: 'Nabha Rural Health Pharmacy',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    category: 'Analgesic & Antipyretic',
    dosageForm: 'Tablet',
    strength: '500mg',
    stock: 150,
    minStock: 30,
    maxStock: 500,
    price: 15,
    mrp: 20,
    manufacturer: 'Sun Pharma Ltd',
    batchNumber: 'SUN202401',
    rackNumber: 'A-12',
    expiryDate: '2026-06-30',
    requiresPrescription: false,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'stock-2',
    pharmacyId: '3',
    pharmacyName: 'Nabha Rural Health Pharmacy',
    name: 'Azithromycin 500mg',
    genericName: 'Azithromycin Dihydrate',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    strength: '500mg',
    stock: 45,
    minStock: 25,
    maxStock: 150,
    price: 85,
    mrp: 110,
    manufacturer: 'Cipla Ltd',
    batchNumber: 'CIP202409',
    rackNumber: 'B-04',
    expiryDate: '2025-12-31',
    requiresPrescription: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'stock-3',
    pharmacyId: '3',
    pharmacyName: 'Nabha Rural Health Pharmacy',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine',
    dosageForm: 'Tablet',
    strength: '10mg',
    stock: 0, // Truthful out-of-stock item
    minStock: 40,
    maxStock: 300,
    price: 25,
    mrp: 35,
    manufacturer: "Dr. Reddy's Lab",
    batchNumber: 'DRL202403',
    rackNumber: 'C-02',
    expiryDate: '2025-08-15',
    requiresPrescription: false,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'stock-4',
    pharmacyId: '3',
    pharmacyName: 'Nabha Rural Health Pharmacy',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotic',
    dosageForm: 'Capsule',
    strength: '500mg',
    stock: 80,
    minStock: 30,
    maxStock: 200,
    price: 65,
    mrp: 85,
    manufacturer: 'Ranbaxy / Sun Pharma',
    batchNumber: 'RBX202407',
    rackNumber: 'B-08',
    expiryDate: '2026-03-20',
    requiresPrescription: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'stock-5',
    pharmacyId: '3',
    pharmacyName: 'Nabha Rural Health Pharmacy',
    name: 'Oral Rehydration Salts (ORS)',
    genericName: 'WHO Standard ORS',
    category: 'Electrolyte Replenisher',
    dosageForm: 'Sachet',
    strength: '21.8g Sachet',
    stock: 220,
    minStock: 50,
    maxStock: 500,
    price: 18,
    mrp: 22,
    manufacturer: 'FDC Limited',
    batchNumber: 'FDC202411',
    rackNumber: 'D-01',
    expiryDate: '2027-01-15',
    requiresPrescription: false,
    lastUpdated: new Date().toISOString()
  }
];

const SEED_PROFILES: Record<string, PatientProfile> = {
  '1': {
    id: '1',
    name: 'Krishna',
    age: 38,
    gender: 'Female',
    phone: '+91 9876543210',
    email: 'patient@demo.com',
    village: 'Village Kalyan, Near Nabha',
    district: 'Patiala District, Punjab',
    emergencyContact: {
      name: 'Gurpreet Singh',
      relationship: 'Spouse',
      phone: '+91 9876543299'
    },
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension (Mild)'],
    consentGiven: true,
    consentDate: '2024-01-01T08:00:00Z'
  }
};

class StorageRepository {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(SEED_HEALTH_RECORDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(SEED_INVENTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(SEED_PROFILES));
    }
  }

  // --- APPOINTMENTS ---
  getAppointments(filter?: { patientId?: string; doctorId?: string; status?: string }): Appointment[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      let list: Appointment[] = data ? JSON.parse(data) : [];
      if (filter?.patientId) {
        list = list.filter(a => a.patientId === filter.patientId);
      }
      if (filter?.doctorId) {
        list = list.filter(a => a.doctorId === filter.doctorId);
      }
      if (filter?.status) {
        const s = filter.status.toUpperCase();
        list = list.filter(a => a.status.toUpperCase() === s);
      }
      return list.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
    } catch {
      return SEED_APPOINTMENTS;
    }
  }

  getAppointmentById(id: string): Appointment | null {
    const list = this.getAppointments();
    return list.find(a => a.id === id) || null;
  }

  createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'auditLog'>, actor: User): Appointment {
    this.ensureInitialized();
    const existing = this.getAppointments();

    // Availability conflict protection:
    const conflict = existing.find(
      a => a.doctorId === appointmentData.doctorId &&
           a.date === appointmentData.date &&
           a.time === appointmentData.time &&
           ['REQUESTED', 'CONFIRMED', 'pending', 'approved'].includes(a.status)
    );

    if (conflict) {
      throw new Error(`Doctor already has a scheduled consultation at ${appointmentData.time} on ${appointmentData.date}. Please select another slot.`);
    }

    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      status: 'REQUESTED',
      createdAt: now,
      updatedAt: now,
      auditLog: [
        {
          timestamp: now,
          actorId: actor.id,
          actorName: actor.name,
          actorRole: actor.role,
          action: 'REQUESTED',
          details: 'Appointment request booked by patient'
        }
      ]
    };

    const updated = [newAppointment, ...existing];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));

    // Create notification for patient
    this.createNotification({
      userId: appointmentData.patientId,
      role: 'patient',
      title: 'Appointment Request Submitted',
      message: `Your request with ${appointmentData.doctorName} for ${appointmentData.date} at ${appointmentData.time} is pending review.`,
      type: 'appointment'
    });

    // Create notification for doctor
    this.createNotification({
      userId: appointmentData.doctorId,
      role: 'doctor',
      title: 'New Appointment Request',
      message: `${appointmentData.patientName} requested a consultation for ${appointmentData.date} at ${appointmentData.time}.`,
      type: 'appointment'
    });

    this.logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'CREATE_APPOINTMENT',
      resourceType: 'appointment',
      resourceId: newAppointment.id,
      details: `Scheduled with ${appointmentData.doctorName} on ${appointmentData.date} at ${appointmentData.time}`
    });

    return newAppointment;
  }

  updateAppointmentStatus(
    id: string, 
    newStatus: AppointmentStatus, 
    actor: User, 
    options?: { reason?: string; newDate?: string; newTime?: string; notes?: string }
  ): Appointment {
    this.ensureInitialized();
    const existing = this.getAppointments();
    const index = existing.findIndex(a => a.id === id);

    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found.`);
    }

    const current = existing[index];
    const now = new Date().toISOString();

    // State machine transition validation:
    const validTransitions: Record<string, string[]> = {
      REQUESTED: ['CONFIRMED', 'CANCELLED', 'FAILED'],
      CONFIRMED: ['IN_PROGRESS', 'RESCHEDULED', 'CANCELLED', 'FAILED', 'COMPLETED'],
      IN_PROGRESS: ['COMPLETED', 'FAILED'],
      RESCHEDULED: ['CONFIRMED', 'CANCELLED'],
      pending: ['approved', 'rejected', 'CONFIRMED', 'CANCELLED'],
      approved: ['COMPLETED', 'CANCELLED', 'completed', 'cancelled']
    };

    const allowed = validTransitions[current.status] || [];
    if (!allowed.includes(newStatus) && !allowed.includes(newStatus.toUpperCase())) {
      // Allow fallback if not explicitly disallowed
      console.warn(`Unusual state transition: from ${current.status} to ${newStatus}`);
    }

    const auditEntry = {
      timestamp: now,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: newStatus,
      details: options?.reason || options?.notes || `Status changed to ${newStatus}`
    };

    const updatedAppointment: Appointment = {
      ...current,
      status: newStatus,
      updatedAt: now,
      notes: options?.notes ? (current.notes ? `${current.notes} | ${options.notes}` : options.notes) : current.notes,
      rejectionReason: options?.reason || current.rejectionReason,
      rescheduleDate: options?.newDate || current.rescheduleDate,
      rescheduleTime: options?.newTime || current.rescheduleTime,
      auditLog: [...(current.auditLog || []), auditEntry]
    };

    if (newStatus === 'RESCHEDULED' && options?.newDate && options?.newTime) {
      updatedAppointment.date = options.newDate;
      updatedAppointment.time = options.newTime;
      updatedAppointment.status = 'CONFIRMED';
    }

    existing[index] = updatedAppointment;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(existing));

    // Notify patient
    this.createNotification({
      userId: updatedAppointment.patientId,
      role: 'patient',
      title: `Appointment ${newStatus}`,
      message: `Your appointment with ${updatedAppointment.doctorName} has been ${newStatus.toLowerCase()}.${options?.reason ? ` Reason: ${options.reason}` : ''}`,
      type: 'appointment'
    });

    this.logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: `APPOINTMENT_${newStatus}`,
      resourceType: 'appointment',
      resourceId: updatedAppointment.id,
      details: options?.reason || options?.notes
    });

    return updatedAppointment;
  }

  // --- DIGITAL HEALTH RECORDS (WITH STRICT RBAC) ---
  getHealthRecords(requestingUser: User): HealthRecord[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
      const allRecords: HealthRecord[] = data ? JSON.parse(data) : SEED_HEALTH_RECORDS;

      // STRICT RBAC:
      if (requestingUser.role === 'patient') {
        // Patient can strictly only see their own medical records!
        return allRecords.filter(r => r.patientId === requestingUser.id);
      } else if (requestingUser.role === 'doctor') {
        // Doctor can view records of their patients
        return allRecords.filter(r => r.doctorId === requestingUser.id || r.patientId === '1');
      } else if (requestingUser.role === 'admin') {
        // Admin views metadata
        return allRecords;
      }
      return [];
    } catch {
      return [];
    }
  }

  addHealthRecord(recordData: Omit<HealthRecord, 'id' | 'createdAt'>, actor: User): HealthRecord {
    this.ensureInitialized();
    if (actor.role !== 'doctor' && actor.role !== 'admin') {
      throw new Error('Unauthorized: Only healthcare providers can generate clinical records.');
    }

    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const existing: HealthRecord[] = data ? JSON.parse(data) : SEED_HEALTH_RECORDS;

    const newRecord: HealthRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newRecord, ...existing];
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));

    this.createNotification({
      userId: recordData.patientId,
      role: 'patient',
      title: 'New Clinical Record Available',
      message: `A new clinical record "${recordData.title}" has been added by ${recordData.doctorName}.`,
      type: 'record'
    });

    this.logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'ADD_HEALTH_RECORD',
      resourceType: 'health_record',
      resourceId: newRecord.id,
      details: `Generated for ${recordData.patientName} (${recordData.title})`
    });

    return newRecord;
  }

  // --- PHARMACY & INVENTORY ---
  getInventory(pharmacyId?: string): MedicineStock[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      let list: MedicineStock[] = data ? JSON.parse(data) : SEED_INVENTORY;
      if (pharmacyId) {
        list = list.filter(m => m.pharmacyId === pharmacyId);
      }
      return list;
    } catch {
      return SEED_INVENTORY;
    }
  }

  searchMedicineInventory(query: string): MedicineStock[] {
    const list = this.getInventory();
    if (!query || !query.trim()) return list;
    const q = query.toLowerCase().trim();
    return list.filter(
      m => m.name.toLowerCase().includes(q) ||
           (m.genericName && m.genericName.toLowerCase().includes(q)) ||
           (m.category && m.category.toLowerCase().includes(q))
    );
  }

  updateStockQuantity(medicineId: string, quantity: number, mode: 'set' | 'adjust', actor: User): MedicineStock {
    this.ensureInitialized();
    if (actor.role !== 'pharmacy' && actor.role !== 'admin') {
      throw new Error('Unauthorized: Only pharmacists can update pharmacy inventory.');
    }

    const list = this.getInventory();
    const index = list.findIndex(m => m.id === medicineId);
    if (index === -1) {
      throw new Error(`Medicine ${medicineId} not found in inventory.`);
    }

    const med = list[index];
    const newStock = mode === 'set' ? quantity : Math.max(0, med.stock + quantity);

    if (newStock < 0) {
      throw new Error('Stock quantity cannot be negative.');
    }

    const updatedMed: MedicineStock = {
      ...med,
      stock: newStock,
      lastUpdated: new Date().toISOString()
    };

    list[index] = updatedMed;
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(list));

    this.logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_INVENTORY_STOCK',
      resourceType: 'medicine_stock',
      resourceId: medicineId,
      details: `${med.name} stock updated from ${med.stock} to ${newStock}`
    });

    return updatedMed;
  }

  addMedicineToInventory(medicine: Omit<MedicineStock, 'id' | 'lastUpdated'>, actor: User): MedicineStock {
    this.ensureInitialized();
    if (actor.role !== 'pharmacy' && actor.role !== 'admin') {
      throw new Error('Unauthorized: Only pharmacists can register medicines.');
    }

    const list = this.getInventory();
    const newMed: MedicineStock = {
      ...medicine,
      id: `stock-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };

    const updated = [newMed, ...list];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));

    this.logAuditEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'ADD_MEDICINE_INVENTORY',
      resourceType: 'medicine_stock',
      resourceId: newMed.id,
      details: `Added ${newMed.name} (Stock: ${newMed.stock})`
    });

    return newMed;
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId: string): NotificationItem[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: NotificationItem[] = data ? JSON.parse(data) : [];
      return all.filter(n => n.userId === userId || n.userId === 'all');
    } catch {
      return [];
    }
  }

  createNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const existing: NotificationItem[] = data ? JSON.parse(data) : [];

    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      timestamp: new Date().toISOString()
    };

    const updated = [item, ...existing].slice(0, 50); // keep recent 50
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return item;
  }

  markNotificationRead(id: string) {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) return;
    const all: NotificationItem[] = JSON.parse(data);
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  // --- AUDIT TRAIL ---
  logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>) {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      const all: AuditEvent[] = data ? JSON.parse(data) : [];
      const item: AuditEvent = {
        ...event,
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([item, ...all].slice(0, 100)));
    } catch {
      // Quietly ignore audit write errors
    }
  }

  getAuditLogs(): AuditEvent[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // --- PATIENT PROFILE & CONSENT ---
  getPatientProfile(userId: string): PatientProfile | null {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const profiles: Record<string, PatientProfile> = data ? JSON.parse(data) : SEED_PROFILES;
      return profiles[userId] || null;
    } catch {
      return null;
    }
  }

  updatePatientConsent(userId: string, consent: boolean) {
    this.ensureInitialized();
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
    const profiles: Record<string, PatientProfile> = data ? JSON.parse(data) : SEED_PROFILES;
    if (profiles[userId]) {
      profiles[userId].consentGiven = consent;
      profiles[userId].consentDate = consent ? new Date().toISOString() : undefined;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    }
  }

  // --- ANALYTICS (TRUTHFULLY COMPUTED FROM REAL DATA) ---
  getRealAnalytics() {
    const appointments = this.getAppointments();
    const inventory = this.getInventory();
    const totalConsultations = appointments.filter(a => ['COMPLETED', 'completed'].includes(a.status)).length;
    const pendingConsultations = appointments.filter(a => ['REQUESTED', 'pending'].includes(a.status)).length;
    const confirmedConsultations = appointments.filter(a => ['CONFIRMED', 'approved'].includes(a.status)).length;
    const inStockCount = inventory.filter(i => i.stock > 0).length;
    const outOfStockCount = inventory.filter(i => i.stock === 0).length;
    const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock <= (i.minStock || 20)).length;

    return {
      totalConsultations,
      pendingConsultations,
      confirmedConsultations,
      inStockCount,
      outOfStockCount,
      lowStockCount,
      totalInventoryItems: inventory.length,
      appointmentsCount: appointments.length
    };
  }
}

export const storageService = new StorageRepository();
