/**
 * Pure-JS storage helper for Node test runner.
 * Mirrors the logic in src/services/storage.ts without TypeScript imports.
 * Used by appointments, records-rbac, and pharmacy tests.
 */

const STORAGE_KEYS = {
  APPOINTMENTS: 'healthbridge_appointments',
  RECORDS: 'healthbridge_health_records',
  INVENTORY: 'healthbridge_inventory',
  NOTIFICATIONS: 'healthbridge_notifications',
  AUDIT_LOGS: 'healthbridge_audit_logs',
  PROFILES: 'healthbridge_patient_profiles'
};

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function readJSON(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Seed Data ─────────────────────────────────────────────────────────────

const SEED_INVENTORY = [
  { id: 'med-1', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 250, unit: 'tablets', price: 2.5, reorderLevel: 50, expiryDate: '2026-12', supplier: 'Sun Pharma', batchNo: 'SUN-2024-001' },
  { id: 'med-2', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 180, unit: 'capsules', price: 8.0, reorderLevel: 30, expiryDate: '2026-08', supplier: 'Cipla', batchNo: 'CIP-2024-002' },
  { id: 'med-3', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 120, unit: 'tablets', price: 5.5, reorderLevel: 40, expiryDate: '2026-06', supplier: 'Dr. Reddys', batchNo: 'DRL-2024-003' },
  { id: 'med-4', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 0, unit: 'tablets', price: 3.0, reorderLevel: 25, expiryDate: '2026-10', supplier: 'Mankind Pharma', batchNo: 'MAN-2024-004' }
];

const SEED_HEALTH_RECORDS = [
  { id: 'rec-1', patientId: '1', patientName: 'Krishna', doctorId: '2', doctorName: 'Dr. Rachit', title: 'Blood Pressure Monitoring Report', type: 'Lab Test', date: '2024-01-10', status: 'ready', fileSize: '1.2 MB', summary: 'BP: 138/88 mmHg — Stage 1 hypertension. Advised dietary changes.' },
  { id: 'rec-2', patientId: '1', patientName: 'Krishna', doctorId: '2', doctorName: 'Dr. Rachit', title: 'General Consultation Notes', type: 'General Consultation', date: '2024-01-08', status: 'ready', fileSize: '450 KB', summary: 'Vitals stable. Follow-up in 2 weeks.' },
  { id: 'rec-3', patientId: '1', patientName: 'Krishna', doctorId: '2', doctorName: 'Dr. Rachit', title: 'Diabetic Checkup', type: 'Lab Test', date: '2024-01-05', status: 'ready', fileSize: '950 KB', summary: 'HbA1c: 7.2%. Advising dietary control and medication adjustment.' },
  { id: 'rec-4', patientId: '5', patientName: 'Meera Singh', doctorId: '2', doctorName: 'Dr. Rachit', title: 'Migraine Assessment', type: 'General Consultation', date: '2024-01-12', status: 'ready', fileSize: '320 KB', summary: 'Recurring episodes 2x/month. Prescribed prophylactics.' }
];

// ─── Storage Repository ─────────────────────────────────────────────────────

export class StorageRepository {
  _ensureSeeded() {
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      writeJSON(STORAGE_KEYS.INVENTORY, SEED_INVENTORY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
      writeJSON(STORAGE_KEYS.RECORDS, SEED_HEALTH_RECORDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      writeJSON(STORAGE_KEYS.APPOINTMENTS, []);
    }
  }

  // ── Appointments ───────────────────────────────────────────────────────────

  getAppointments(user) {
    this._ensureSeeded();
    const all = readJSON(STORAGE_KEYS.APPOINTMENTS);
    if (!user) return all;
    if (user.role === 'patient') return all.filter(a => a.patientId === user.id);
    if (user.role === 'doctor') return all.filter(a => a.doctorId === user.id);
    return all;
  }

  createAppointment(data, requestingUser) {
    this._ensureSeeded();
    const appointments = readJSON(STORAGE_KEYS.APPOINTMENTS);
    // Conflict prevention: same doctor, same date, same time
    const conflict = appointments.find(a =>
      a.doctorId === data.doctorId &&
      a.date === data.date &&
      a.time === data.time &&
      !['CANCELLED', 'FAILED'].includes(a.status)
    );
    if (conflict) {
      throw new Error(`This doctor already has a scheduled consultation at ${data.time} on ${data.date}.`);
    }
    const now = new Date().toISOString();
    const appointment = {
      id: uid('apt'),
      ...data,
      status: 'REQUESTED',
      createdAt: now,
      updatedAt: now,
      auditLog: [{
        timestamp: now,
        actorId: requestingUser.id,
        actorName: requestingUser.name,
        actorRole: requestingUser.role,
        action: 'REQUESTED',
        details: 'Appointment request submitted'
      }]
    };
    appointments.push(appointment);
    writeJSON(STORAGE_KEYS.APPOINTMENTS, appointments);
    return appointment;
  }

  updateAppointmentStatus(appointmentId, newStatus, actor, extras = {}) {
    const appointments = readJSON(STORAGE_KEYS.APPOINTMENTS);
    const idx = appointments.findIndex(a => a.id === appointmentId);
    if (idx === -1) throw new Error(`Appointment ${appointmentId} not found.`);
    const apt = { ...appointments[idx] };
    apt.status = newStatus === 'RESCHEDULED' ? 'CONFIRMED' : newStatus;
    if (extras.newDate) apt.date = extras.newDate;
    if (extras.newTime) apt.time = extras.newTime;
    if (extras.notes) apt.notes = extras.notes;
    apt.updatedAt = new Date().toISOString();
    apt.auditLog = [...(apt.auditLog || []), {
      timestamp: apt.updatedAt,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: newStatus,
      details: extras.notes || undefined
    }];
    appointments[idx] = apt;
    writeJSON(STORAGE_KEYS.APPOINTMENTS, appointments);
    return apt;
  }

  // ── Health Records ─────────────────────────────────────────────────────────

  getHealthRecords(user) {
    this._ensureSeeded();
    const all = readJSON(STORAGE_KEYS.RECORDS);
    if (!user) return all;
    if (user.role === 'patient') return all.filter(r => r.patientId === user.id);
    if (user.role === 'doctor') return all.filter(r => r.doctorId === user.id);
    if (user.role === 'admin') return all;
    return [];
  }

  addHealthRecord(data, actor) {
    if (!['doctor', 'admin'].includes(actor.role)) {
      throw new Error('Unauthorized: Only healthcare providers can generate clinical records');
    }
    const records = readJSON(STORAGE_KEYS.RECORDS);
    const record = {
      id: uid('rec'),
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: actor.id
    };
    records.push(record);
    writeJSON(STORAGE_KEYS.RECORDS, records);
    return record;
  }

  // ── Inventory ──────────────────────────────────────────────────────────────

  getInventory() {
    this._ensureSeeded();
    return readJSON(STORAGE_KEYS.INVENTORY);
  }

  updateStockQuantity(medicineId, quantity, mode, actor) {
    if (actor && actor.role !== 'pharmacy' && actor.role !== 'admin') {
      throw new Error('Unauthorized: Only pharmacists can update pharmacy inventory');
    }
    const inventory = readJSON(STORAGE_KEYS.INVENTORY);
    const idx = inventory.findIndex(m => m.id === medicineId);
    if (idx === -1) throw new Error(`Medicine ${medicineId} not found.`);
    const med = { ...inventory[idx] };
    if (mode === 'set') {
      med.stock = Math.max(0, quantity);
    } else {
      med.stock = Math.max(0, med.stock + quantity);
    }
    med.lastUpdated = new Date().toISOString();
    inventory[idx] = med;
    writeJSON(STORAGE_KEYS.INVENTORY, inventory);
    return med;
  }
}

export const storageService = new StorageRepository();
