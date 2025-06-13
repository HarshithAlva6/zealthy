import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Update user data
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { about, address, birthdate, currentStep, completed } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (about !== undefined) {
      updates.push(`about = $${paramCount}`);
      values.push(about);
      paramCount++;
    }

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(address.street);
      paramCount++;
      
      updates.push(`city = $${paramCount}`);
      values.push(address.city);
      paramCount++;
      
      updates.push(`state = $${paramCount}`);
      values.push(address.state);
      paramCount++;
      
      updates.push(`zip = $${paramCount}`);
      values.push(address.zip);
      paramCount++;
    }

    if (birthdate !== undefined) {
      updates.push(`birthdate = $${paramCount}`);
      values.push(birthdate);
      paramCount++;
    }

    if (currentStep !== undefined) {
      updates.push(`onboarding_step = $${paramCount}`);
      values.push(currentStep);
      paramCount++;
    }

    if (updates.length === 0 && !completed) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE user_data 
      SET ${updates.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // If completed, mark user as completed
    if (completed) {
      await pool.query(
        'UPDATE users SET completed = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users data for table view
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.created, u.completed,
             ud.about, ud.address, ud.city, 
             ud.state, ud.zip, ud.birthdate, ud.onboarding_step,
             CASE WHEN u.completed IS NOT NULL THEN true ELSE false END as completed
      FROM users u
      LEFT JOIN user_data ud ON u.id = ud.user_id
      ORDER BY u.created DESC
    `);

    // Transform data to match frontend expectations
    const users = result.rows.map(row => ({
      id: row.id.toString(),
      email: row.email,
      created: row.created,
      completed: row.completed,
      onboarding: row.onboarding_step,
      about: row.about,
      birthdate: row.birthdate,
      address: {
        address: row.address,
        city: row.city,
        state: row.state,
        zip: row.zip
      }
    }));

    res.json(users); // Return array directly, not wrapped in object
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
