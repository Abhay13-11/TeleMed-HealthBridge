import fs from 'fs';
import path from 'path';
import { pool, initDatabaseConnection } from './index.js';

export async function runMigrations() {
  const connected = await initDatabaseConnection();
  if (!connected) {
    console.warn('⚠️ [Migrate] PostgreSQL not connected. Skipping table creation.');
    return;
  }

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('✅ [Migrate] PostgreSQL tables and indexes created successfully.');
  } catch (error) {
    console.error('❌ [Migrate] Migration failed:', error);
    throw error;
  }
}

if (process.argv[1]?.endsWith('migrate.ts')) {
  runMigrations().then(() => {
    console.log('Migration finished.');
    process.exit(0);
  });
}
