import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../../src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);
    console.log('Database schema created successfully');

    // Insert initial data
    await pool.query(`
      INSERT INTO categories (name, image) 
      VALUES 
        ('Electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661'),
        ('Clothing', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f'),
        ('Books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('Initial data inserted successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 