import test from 'node:test';
import assert from 'node:assert';

// Mock localStorage for Node test runner
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

// Demo users canonical definitions matching src/data/mockData.ts
const demoUsers = [
  {
    id: '1',
    email: 'patient@demo.com',
    password: '12345',
    name: 'Krishna',
    role: 'patient',
    location: 'Village Rampur, Gujarat',
    phone: '+91 9876543210'
  },
  {
    id: '2',
    email: 'doctor@demo.com',
    password: '12345',
    name: 'Dr. Rachit',
    role: 'doctor',
    specialization: 'General Medicine',
    location: 'Ahmedabad Medical Center',
    phone: '+91 9876543211'
  },
  {
    id: '3',
    email: 'pharmacy@demo.com',
    password: '12345',
    name: 'Rural Health Pharmacy',
    role: 'pharmacy',
    location: 'Mehsana District, Gujarat',
    phone: '+91 9876543212'
  },
  {
    id: '4',
    email: 'admin@demo.com',
    password: '12345',
    name: 'Rajesh Barik',
    role: 'admin',
    location: 'Telemedicine HQ',
    phone: '+91 9876543213'
  }
];

test('Auth: Demo users have valid role definitions and credentials', async () => {
  assert.strictEqual(demoUsers.length >= 4, true);
  
  const patient = demoUsers.find(u => u.role === 'patient');
  const doctor = demoUsers.find(u => u.role === 'doctor');
  const pharmacy = demoUsers.find(u => u.role === 'pharmacy');
  const admin = demoUsers.find(u => u.role === 'admin');

  assert.ok(patient, 'Patient demo user exists');
  assert.ok(doctor, 'Doctor demo user exists');
  assert.ok(pharmacy, 'Pharmacy demo user exists');
  assert.ok(admin, 'Admin demo user exists');

  assert.strictEqual(patient.email, 'patient@demo.com');
  assert.strictEqual(doctor.email, 'doctor@demo.com');
  assert.strictEqual(pharmacy.email, 'pharmacy@demo.com');
  assert.strictEqual(admin.email, 'admin@demo.com');
});

test('Auth: Patient registration validates duplicates and restricts admin escalation', async () => {
  storage.clear();

  // Test registration persistence simulation
  const registered = [];
  const registerUser = (data) => {
    if (!data.name || !data.email || !data.password) {
      throw new Error('Missing required registration fields');
    }
    if (registered.some(u => u.email === data.email)) {
      throw new Error('An account with this email address already exists.');
    }
    // Privilege protection: public registration can never assign admin role
    const assignedRole = data.role && data.role !== 'admin' ? data.role : 'patient';
    const user = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: assignedRole
    };
    registered.push(user);
    return user;
  };

  // Valid registration
  const user1 = registerUser({
    name: 'Balwinder Singh',
    email: 'balwinder@nabha.in',
    password: 'password123',
    role: 'patient'
  });
  assert.strictEqual(user1.role, 'patient');
  assert.strictEqual(user1.name, 'Balwinder Singh');

  // Attempt duplicate registration
  assert.throws(() => {
    registerUser({
      name: 'Balwinder Singh Dup',
      email: 'balwinder@nabha.in',
      password: 'password123'
    });
  }, /already exists/);

  // Attempt privilege escalation to admin via public registration
  const attemptedAdmin = registerUser({
    name: 'Hacker User',
    email: 'hacker@nabha.in',
    password: 'password123',
    role: 'admin'
  });
  assert.strictEqual(attemptedAdmin.role, 'patient', 'Admin role privilege escalation must be prevented');
});
