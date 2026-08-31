import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
  const rows = await sql`SELECT id, index, name, category, sort_order FROM projects ORDER BY sort_order ASC;`;
  console.log('✅ Connected to Neon Cloud PostgreSQL.');
  console.log(`Total projects in DB: ${rows.length}`);
  console.table(rows);
}

check().catch(console.error);
