process.env.NODE_ENV = 'test';

import test, { before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';

const { startServer } = await import('../dist/index.js');

let runningServer;
let baseUrl = '';

before(async () => {
  runningServer = await startServer(0);
  const port = runningServer.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  if (runningServer) {
    runningServer.close();
  }
});

function requestJson(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const bodyStr = options.body ? JSON.stringify(options.body) : null;
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };
    if (bodyStr) {
      reqOptions.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        } catch {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

test('Backend API: Health Check', async () => {
  const res = await requestJson('/api/health');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, 'healthy');
  assert.strictEqual(res.body.service, 'HealthBridge Telemedicine API');
});

test('Backend API: Auth Login with Demo Credentials', async () => {
  const res = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email: 'patient@demo.com', password: '12345' }
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token, 'JWT token returned');
  assert.strictEqual(res.body.user.role, 'patient');
  assert.strictEqual(res.body.user.email, 'patient@demo.com');
});

test('Backend API: Register prevents admin privilege escalation', async () => {
  const testEmail = `test-patient-${Date.now()}@nabha.in`;
  const res = await requestJson('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Harpreet Kaur',
      email: testEmail,
      password: 'securepassword123',
      role: 'admin' // Attempted privilege escalation
    }
  });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.user.role, 'patient', 'Must strictly assign patient role');
  assert.ok(res.body.token);
});

test('Backend API: Appointment conflict prevention and 7-state transitions', async () => {
  // 1. Login as patient
  const loginRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email: 'patient@demo.com', password: '12345' }
  });
  const token = loginRes.body.token;

  const testDate = `2026-12-${Date.now().toString().slice(-6)}`;
  const testTime = '11:00 AM';

  // 2. Book appointment slot
  const bookRes1 = await requestJson('/api/appointments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      doctorId: '2',
      doctorName: 'Dr. Rachit Kumar',
      specialty: 'General Medicine',
      date: testDate,
      time: testTime,
      type: 'video',
      symptoms: 'Mild joint stiffness'
    }
  });

  assert.strictEqual(bookRes1.statusCode, 201);
  assert.strictEqual(bookRes1.body.data.status, 'REQUESTED');
  assert.strictEqual(bookRes1.body.data.auditLog.length, 1);

  // 3. Attempt duplicate booking on same slot (Conflict Protection)
  const bookRes2 = await requestJson('/api/appointments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      doctorId: '2',
      doctorName: 'Dr. Rachit Kumar',
      specialty: 'General Medicine',
      date: testDate,
      time: testTime,
      type: 'video',
      symptoms: 'Severe headache'
    }
  });

  assert.strictEqual(bookRes2.statusCode, 409, 'Conflict status code 409 expected');
  assert.match(bookRes2.body.message, /already has a scheduled consultation/);

  // 4. Doctor logs in and confirms appointment
  const docLogin = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email: 'doctor@demo.com', password: '12345' }
  });
  const docToken = docLogin.body.token;

  const confirmRes = await requestJson(`/api/appointments/${bookRes1.body.data.id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${docToken}` },
    body: { status: 'CONFIRMED', notes: 'Confirmed for Video Room 1' }
  });

  assert.strictEqual(confirmRes.statusCode, 200);
  assert.strictEqual(confirmRes.body.data.status, 'CONFIRMED');
  assert.strictEqual(confirmRes.body.data.auditLog.length, 2);
});

test('Backend API: Health records RBAC and patient isolation', async () => {
  // Patient Krishna login
  const patientRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email: 'patient@demo.com', password: '12345' }
  });
  const patientToken = patientRes.body.token;

  // Retrieve records as patient
  const recordsRes = await requestJson('/api/records', {
    headers: { Authorization: `Bearer ${patientToken}` }
  });

  assert.strictEqual(recordsRes.statusCode, 200);
  assert.ok(Array.isArray(recordsRes.body.data));
  assert.strictEqual(
    recordsRes.body.data.every(r => r.patientId === '1'),
    true,
    'Patient must only see their own records'
  );

  // Patient attempting to write a clinical record must be forbidden (403)
  const forgeRes = await requestJson('/api/records', {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}` },
    body: {
      patientId: '1',
      patientName: 'Krishna',
      title: 'Forged Lab Result',
      type: 'Lab Test',
      date: '2026-10-20',
      summary: 'Self-certified recovery'
    }
  });

  assert.strictEqual(forgeRes.statusCode, 403, 'Patients cannot create clinical records');
});

test('Backend API: Medicine Inventory queries and non-negative clamping', async () => {
  // Public search
  const searchRes = await requestJson('/api/inventory?query=Paracetamol');

  assert.strictEqual(searchRes.statusCode, 200);
  assert.ok(searchRes.body.data.length > 0);
  assert.strictEqual(searchRes.body.data[0].name, 'Paracetamol 500mg');

  // Pharmacist stock update
  const pharmRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email: 'pharmacy@demo.com', password: '12345' }
  });
  const pharmToken = pharmRes.body.token;

  // Adjust stock by -1000 (should clamp at 0 and not become negative)
  const adjustRes = await requestJson('/api/inventory/stock-1/stock', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmToken}` },
    body: { quantity: -1000, mode: 'adjust' }
  });

  assert.strictEqual(adjustRes.statusCode, 200);
  assert.strictEqual(adjustRes.body.data.stock, 0, 'Stock must not become negative');
});
