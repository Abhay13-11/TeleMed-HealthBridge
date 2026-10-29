import bcrypt from 'bcryptjs';
import { localStore, pool, isDbConnected } from './index.js';

export async function seedInitialData() {
  const salt = await bcrypt.genSalt(10);
  const defaultHashedPassword = await bcrypt.hash('12345', salt);

  const users = [
    {
      id: '1',
      name: 'Krishna',
      email: 'patient@demo.com',
      password: defaultHashedPassword,
      role: 'patient',
      location: 'Village Rampur, Punjab',
      phone: '+91 9876543210',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Dr. Rachit Kumar',
      email: 'doctor@demo.com',
      password: defaultHashedPassword,
      role: 'doctor',
      specialization: 'General Medicine',
      location: 'Nabha Civil Hospital OPD',
      phone: '+91 9876543211',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Nabha Rural Health Pharmacy',
      email: 'pharmacy@demo.com',
      password: defaultHashedPassword,
      role: 'pharmacy',
      location: 'Civil Hospital Road, Nabha, Punjab',
      phone: '+91 9876543212',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Abhay Singh Chauhan',
      email: 'admin@demo.com',
      password: defaultHashedPassword,
      role: 'admin',
      location: 'Telemedicine Operations HQ',
      phone: '+91 9876543213',
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Meera Singh',
      email: 'meera@nabha.in',
      password: defaultHashedPassword,
      role: 'patient',
      location: 'Village Alhoran, Nabha',
      phone: '+91 9876543214',
      createdAt: new Date().toISOString()
    }
  ];

  const appointments = [
    {
      id: 'apt-101',
      patientId: '1',
      patientName: 'Krishna',
      doctorId: '2',
      doctorName: 'Dr. Rachit Kumar',
      specialty: 'General Medicine',
      date: '2026-11-15',
      time: '10:00 AM',
      type: 'video',
      status: 'REQUESTED',
      symptoms: 'Persistent fever, dry cough and generalized body pain for 3 days',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLog: [
        {
          timestamp: new Date().toISOString(),
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
      doctorName: 'Dr. Rachit Kumar',
      specialty: 'General Medicine',
      date: '2026-11-16',
      time: '02:00 PM',
      type: 'in-person',
      status: 'CONFIRMED',
      symptoms: 'Recurring migraine, sensitivity to bright light, mild nausea',
      notes: 'Scheduled for in-person review at Nabha Civil Hospital OPD Room 4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          actorId: '5',
          actorName: 'Meera Singh',
          actorRole: 'patient',
          action: 'REQUESTED'
        },
        {
          timestamp: new Date().toISOString(),
          actorId: '2',
          actorName: 'Dr. Rachit Kumar',
          actorRole: 'doctor',
          action: 'CONFIRMED',
          details: 'Confirmed by attending physician'
        }
      ]
    }
  ];

  const medicines = [
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
      price: 15.00,
      mrp: 20.00,
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
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin Trihydrate',
      category: 'Antibiotic',
      dosageForm: 'Capsule',
      strength: '500mg',
      stock: 45,
      minStock: 25,
      maxStock: 200,
      price: 72.00,
      mrp: 88.00,
      manufacturer: 'Cipla Healthcare',
      batchNumber: 'CIP202409',
      rackNumber: 'B-04',
      expiryDate: '2026-11-30',
      requiresPrescription: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'stock-3',
      pharmacyId: '3',
      pharmacyName: 'Nabha Rural Health Pharmacy',
      name: 'Metformin 500mg',
      genericName: 'Metformin Hydrochloride',
      category: 'Antidiabetic',
      dosageForm: 'Tablet',
      strength: '500mg',
      stock: 8,
      minStock: 20,
      maxStock: 300,
      price: 28.00,
      mrp: 35.00,
      manufacturer: 'Dr. Reddy Labs',
      batchNumber: 'DRL202403',
      rackNumber: 'C-01',
      expiryDate: '2026-04-15',
      requiresPrescription: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'stock-4',
      pharmacyId: '3',
      pharmacyName: 'Nabha Rural Health Pharmacy',
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine Hydrochloride',
      category: 'Antihistamine',
      dosageForm: 'Tablet',
      strength: '10mg',
      stock: 0,
      minStock: 15,
      maxStock: 150,
      price: 18.00,
      mrp: 24.00,
      manufacturer: 'Torrent Pharma',
      batchNumber: 'TOR202402',
      rackNumber: 'A-05',
      expiryDate: '2026-08-31',
      requiresPrescription: false,
      lastUpdated: new Date().toISOString()
    }
  ];

  const records = [
    {
      id: 'rec-1',
      patientId: '1',
      patientName: 'Krishna',
      doctorId: '2',
      doctorName: 'Dr. Rachit Kumar',
      title: 'Blood Pressure & Vitals Assessment',
      type: 'Lab Test',
      date: '2026-10-10',
      status: 'ready',
      fileSize: '1.2 MB',
      summary: 'BP: 138/88 mmHg — Stage 1 hypertension. Patient advised low-sodium diet and follow up in 2 weeks.',
      createdBy: '2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'rec-2',
      patientId: '5',
      patientName: 'Meera Singh',
      doctorId: '2',
      doctorName: 'Dr. Rachit Kumar',
      title: 'Neurological & Migraine Review',
      type: 'General Consultation',
      date: '2026-10-12',
      status: 'ready',
      fileSize: '450 KB',
      summary: 'Recurring migraine episodes 2x/month. Prescribed prophylactic treatment and sleep routine advice.',
      createdBy: '2',
      createdAt: new Date().toISOString()
    }
  ];

  const auditLogs = [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      actorId: 'system',
      actorName: 'System Initializer',
      actorRole: 'admin',
      action: 'SYSTEM_SEEDED',
      entityType: 'system',
      details: 'HealthBridge database initialized with Nabha regional clinical seed data'
    }
  ];

  // Seed local fallback store
  const existing = localStore.get();
  if (!existing.users || existing.users.length === 0) {
    localStore.save({ users, appointments, medicines, records, auditLogs });
    console.log('✅ [Seed] Resilient local store seeded with demo users and clinical records.');
  }

  // Seed PostgreSQL if connected
  if (isDbConnected()) {
    try {
      for (const u of users) {
        await pool.query(
          `INSERT INTO users (id, name, email, password, role, phone, location, specialization)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (email) DO NOTHING`,
          [u.id, u.name, u.email, u.password, u.role, u.phone, u.location, u.specialization || null]
        );
      }
      console.log('✅ [Seed] PostgreSQL users seeded.');
    } catch (err) {
      console.error('Error seeding PG users:', err);
    }
  }
}

// Allow CLI execution: tsx src/db/seed.ts
if (process.argv[1]?.endsWith('seed.ts')) {
  seedInitialData().then(() => {
    console.log('Seed completed.');
    process.exit(0);
  });
}
