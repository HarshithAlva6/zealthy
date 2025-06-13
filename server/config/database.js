import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env)
// Database config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER || 'harsh',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zealthy_db',
  password: process.env.DB_PASSWORD || 'alva',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DATABASE_URL
  ? { rejectUnauthorized: false } // required for Render
  : false, 
});

export { pool };

// Initialize tables
export async function initializeDatabase() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed TIMESTAMP
      )
    `);

    // User data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        about TEXT,
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(50),
        zip VARCHAR(20),
        birthdate DATE,
        onboarding_step INTEGER DEFAULT 1,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin configuration table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS onboarding (
        id SERIAL PRIMARY KEY,
        page2 TEXT[] DEFAULT ARRAY['about', 'birthdate'],
        page3 TEXT[] DEFAULT ARRAY['address'],
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default configuration if not exists
    const configExists = await pool.query('SELECT id FROM onboarding LIMIT 1');
    if (configExists.rows.length === 0) {
      await pool.query(`
        INSERT INTO onboarding (page2, page3)
        VALUES (ARRAY['about','birthdate'], ARRAY['address'])
      `);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}