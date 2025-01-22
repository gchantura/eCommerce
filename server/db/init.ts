import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  try {
    // Create tables
    await pool.query(`
      -- Categories Table
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL
      );

      -- Products Table
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        image VARCHAR(255),
        stock INTEGER NOT NULL DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        on_sale BOOLEAN DEFAULT false,
        original_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Users Table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Reviews Table
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert some initial data
    await pool.query(`
      INSERT INTO categories (name, image) 
      VALUES 
        ('Electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661'),
        ('Accessories', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f'),
        ('Bags', 'https://images.unsplash.com/photo-1547949003-9792a18a2601')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
};

initDb(); 