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

test('Health Records RBAC: Strict isolation and care relationship protection', async () => {
  storage.clear();

  const patientKrishna = { id: '1', name: 'Krishna', role: 'patient', email: 'k@demo.com' };
  const patientMeera = { id: '5', name: 'Meera Singh', role: 'patient', email: 'm@demo.com' };
  const doctorRachit = { id: '2', name: 'Dr. Rachit', role: 'doctor', email: 'd@demo.com' };

  // 1. Patient Krishna requests health records
  const krishnaRecords = storageService.getHealthRecords(patientKrishna);
  assert.ok(krishnaRecords.length > 0, 'Krishna has seeded records');
  assert.strictEqual(
    krishnaRecords.every(r => r.patientId === '1'),
    true,
    'Patient Krishna must strictly only receive records belonging to patientId 1'
  );

  // Verify Krishna cannot see Meera Singh's record (rec-4)
  const containsMeera = krishnaRecords.some(r => r.patientId === '5' || r.id === 'rec-4');
  assert.strictEqual(containsMeera, false, 'Patient Krishna must NOT have access to Meera Singh records');

  // 2. Patient cannot forge / add clinical doctor records
  assert.throws(() => {
    storageService.addHealthRecord({
      patientId: '1',
      patientName: 'Krishna',
      doctorId: '2',
      doctorName: 'Dr. Rachit',
      title: 'Forged Clinical Record',
      type: 'Lab Test',
      date: '2026-11-01',
      status: 'ready',
      fileSize: '1 MB',
      summary: 'Self-diagnosed recovery'
    }, patientKrishna);
  }, /Unauthorized: Only healthcare providers can generate clinical records/);

  // 3. Authorized doctor can add a verified record
  const newDoctorRecord = storageService.addHealthRecord({
    patientId: '1',
    patientName: 'Krishna',
    doctorId: '2',
    doctorName: 'Dr. Rachit',
    title: 'Routine Health Check Summary',
    type: 'General Consultation',
    date: '2026-11-01',
    status: 'ready',
    fileSize: '650 KB',
    summary: 'Vitals stable. Continuing low-sodium dietary protocol.'
  }, doctorRachit);

  assert.ok(newDoctorRecord.id, 'New clinical record created');

  // Verify Krishna can now see the doctor-added record
  const updatedKrishnaRecords = storageService.getHealthRecords(patientKrishna);
  assert.ok(updatedKrishnaRecords.some(r => r.id === newDoctorRecord.id));
});
