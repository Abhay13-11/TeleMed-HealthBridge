-- HealthBridge Telemedicine Production Schema for PostgreSQL

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('patient', 'doctor', 'pharmacy', 'admin')),
  phone VARCHAR(32),
  location VARCHAR(255),
  specialization VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  doctor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(128) NOT NULL,
  date VARCHAR(32) NOT NULL,
  time VARCHAR(32) NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'video',
  status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED' 
    CHECK (status IN ('REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED', 'RESCHEDULED')),
  symptoms TEXT NOT NULL,
  notes TEXT,
  audit_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(doctor_id, date, time);

-- 3. Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  doctor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(128) NOT NULL,
  date VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ready',
  file_size VARCHAR(32) DEFAULT '500 KB',
  summary TEXT NOT NULL,
  notes TEXT,
  prescription_details TEXT,
  created_by VARCHAR(64) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_records_doctor ON health_records(doctor_id);

-- 4. Medicine Inventory Table
CREATE TABLE IF NOT EXISTS medicines (
  id VARCHAR(64) PRIMARY KEY,
  pharmacy_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pharmacy_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  dosage_form VARCHAR(64) NOT NULL,
  strength VARCHAR(64) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock INTEGER NOT NULL DEFAULT 20,
  max_stock INTEGER NOT NULL DEFAULT 500,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  manufacturer VARCHAR(255) NOT NULL,
  batch_number VARCHAR(128) NOT NULL,
  rack_number VARCHAR(64),
  expiry_date VARCHAR(32) NOT NULL,
  requires_prescription BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicines_pharmacy ON medicines(pharmacy_id);

-- 5. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actor_id VARCHAR(64) NOT NULL,
  actor_name VARCHAR(255) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(128) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64),
  details TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
