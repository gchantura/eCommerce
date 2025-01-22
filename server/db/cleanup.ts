import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function cleanup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await pool.query(`
      DROP TABLE IF EXISTS reviews, cart_items, products, categories, users CASCADE;
    `);
    console.log('Successfully dropped all tables');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await pool.end();
  }
}

cleanup(); 