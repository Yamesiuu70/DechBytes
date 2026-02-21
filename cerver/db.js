import dotenv from 'dotenv';
import sql from 'mssql';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'database.sql');
const seedPath = path.join(__dirname, 'seed.sql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  }
};

let pool;

async function connectMssqlDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Connected to MSSQL DB');

      // Run database.sql
      console.log('📦 Running database.sql...');
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      const schemaBatches = schemaSql.split('GO').filter(batch => batch.trim());
      for (const batch of schemaBatches) {
        if (batch.trim()) {
          try {
            await pool.request().query(batch);
          } catch (err) {
            // Ignore "already exists" errors
            if (!err.message.includes('already exists')) {
              console.error('Schema batch error:', err);
            }
          }
        }
      }
      console.log('✅ Database schema initialized/updated.');

      // Run seed.sql
      try {
        console.log('📦 Running seed.sql...');
        const seedSql = await fs.readFile(seedPath, 'utf8');
        const seedBatches = seedSql.split('GO').filter(batch => batch.trim());
        for (const batch of seedBatches) {
          if (batch.trim()) {
            try {
              await pool.request().query(batch);
            } catch (err) {
              // Ignore duplicate key errors and already exists errors
              if (!err.message.includes('duplicate key') && !err.message.includes('already exists')) {
                console.error('Seed batch error:', err);
              }
            }
          }
        }
        console.log('✅ Seed data inserted successfully!');
      } catch (seedErr) {
        if (seedErr.code === 'ENOENT') {
          console.log('⚠️ seed.sql not found - skipping data insertion');
        } else {
          console.error('❌ Error running seed.sql:', seedErr);
        }
      }
    }

    return pool;
  } catch (err) {
    console.error('❌ MSSQL Database Operation Failed! Error:', err);
    process.exit(1);
  }
}

export { sql, connectMssqlDB };