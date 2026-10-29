import test from 'node:test';
import assert from 'node:assert';
import { storageService } from './helpers/storage.mjs';

// Mock localStorage
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

test('Appointments: State machine transitions and conflict prevention', async () => {
  storage.clear();

  const patient = { id: 'usr-1', name: 'Krishna', role: 'patient', email: 'k@demo.com' };
  const doctor = { id: 'doc-1', name: 'Dr. Rachit Kumar', role: 'doctor', email: 'd@demo.com' };

  // 1. Create a valid appointment
  const apt1 = storageService.createAppointment({
    patientId: patient.id,
    patientName: patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: 'General Medicine',
    date: '2026-11-10',
    time: '10:00 AM',
    type: 'video',
    status: 'REQUESTED',
    symptoms: 'Persistent mild fever'
  }, patient);

  assert.strictEqual(apt1.status, 'REQUESTED');
  assert.strictEqual(apt1.auditLog.length, 1);
  assert.strictEqual(apt1.auditLog[0].action, 'REQUESTED');

  // 2. Prevent conflicting booking (same doctor, same date, same slot)
  assert.throws(() => {
    storageService.createAppointment({
      patientId: 'usr-2',
      patientName: 'Another Patient',
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: 'General Medicine',
      date: '2026-11-10',
      time: '10:00 AM',
      type: 'video',
      status: 'REQUESTED',
      symptoms: 'Headache'
    }, { id: 'usr-2', name: 'Another Patient', role: 'patient' });
  }, /already has a scheduled consultation/);

  // 3. Confirm appointment by doctor
  const confirmed = storageService.updateAppointmentStatus(apt1.id, 'CONFIRMED', doctor, {
    notes: 'Confirmed by Dr. Rachit for Room 2'
  });
  assert.strictEqual(confirmed.status, 'CONFIRMED');
  assert.strictEqual(confirmed.auditLog.length, 2);

  // 4. Reschedule appointment
  const rescheduled = storageService.updateAppointmentStatus(apt1.id, 'RESCHEDULED', doctor, {
    newDate: '2026-11-12',
    newTime: '02:00 PM',
    notes: 'Slot moved due to clinical rounds'
  });
  assert.strictEqual(rescheduled.date, '2026-11-12');
  assert.strictEqual(rescheduled.time, '02:00 PM');
  assert.strictEqual(rescheduled.status, 'CONFIRMED');

  // 5. Complete consultation
  const completed = storageService.updateAppointmentStatus(apt1.id, 'COMPLETED', doctor);
  assert.strictEqual(completed.status, 'COMPLETED');
});
