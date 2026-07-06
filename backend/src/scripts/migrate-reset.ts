import 'dotenv/config';
import { Pool } from 'pg';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getConfig } from '../config.js';

const config = getConfig();

if (!config.databaseUrl && !config.dbHost) {
  console.log('Skipping PostgreSQL migration reset because no database configuration was provided.');
  process.exit(0);
}

const pool = new Pool(
  config.databaseUrl
    ? { connectionString: config.databaseUrl }
    : {
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
        user: config.dbUser,
        password: config.dbPassword
      }
);

await pool.query('DROP TABLE IF EXISTS orders CASCADE');
await pool.query('DROP TABLE IF EXISTS tracking_records CASCADE');
await pool.query('DROP TABLE IF EXISTS users CASCADE');

const sql = await readFile(resolve(process.cwd(), 'migrations/001_init.sql'), 'utf8');
await pool.query(sql);
await pool.end();

console.log('Migration reset completed.');
