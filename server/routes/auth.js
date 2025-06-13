import express from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const hashPass = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created',
      [email, hashPass]
    );

    const user = result.rows[0];

    // Create initial user_data record
    await pool.query(
      'INSERT INTO user_data (user_id, onboarding_step) VALUES ($1, $2)',
      [user.id, 2]
    );

    res.status(201).json({
      success: true,
      sessionId: user.id.toString(),
      user: {
        id: user.id,
        email: user.email,
        created: user.created
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Session endpoint
router.get('/session', async (req, res) => {
  try {
    res.json({ sessionId: null });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by email (for returning users)
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query(`
      SELECT u.id, u.email, u.password, u.created, ud.onboarding_step, 
             ud.about, ud.address, 
             ud.city, ud.state, ud.zip, ud.birthdate
      FROM users u
      LEFT JOIN user_data ud ON u.id = ud.user_id
      WHERE u.email = $1
    `, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;