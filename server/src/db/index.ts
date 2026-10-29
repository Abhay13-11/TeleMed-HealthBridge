import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/healthbridge',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let isPostgresAvailable = false;

// Test connection on startup
export async function initDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    isPostgresAvailable = true;
    client.release();
    console.log('✅ [Database] PostgreSQL connected successfully.');
    return true;
  } catch (error) {
    isPostgresAvailable = false;
    console.warn('⚠️ [Database] PostgreSQL connection failed or not running locally.');
    console.warn('ℹ️ [Database] Running in Fallback Resilient In-Memory/Disk Store Mode.');
    console.warn('ℹ️ [Database] To connect PostgreSQL, set DATABASE_URL in server/.env.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isPostgresAvailable;
}

// ---------------------------------------------------------------------------
// Resilient Persistence Store (Operates both in PG and Standalone fallback)
// ---------------------------------------------------------------------------

const LOCAL_STORE_FILE = path.join(__dirname, '..', '..', 'data_store.json');

export interface DataStoreState {
  users: any[];
  appointments: any[];
  records: any[];
  medicines: any[];
  auditLogs: any[];
}

function loadStore(): DataStoreState {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading fallback store:', err);
  }
  return { users: [], appointments: [], records: [], medicines: [], auditLogs: [] };
}

function saveStore(data: DataStoreState) {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving fallback store:', err);
  }
}

export const localStore = {
  get: loadStore,
  save: saveStore,
};
