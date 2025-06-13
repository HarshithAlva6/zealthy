import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Get current configuration
router.get('/config', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM onboarding ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuration not found' });
    }
    const config = {
      page2: result.rows[0].page2,
      page3: result.rows[0].page3
    };
    res.json(config); 
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update configuration
router.put('/config', async (req, res) => {
  try {
    const { page2, page3 } = req.body;

    if (!page2 || page2.length === 0) {
      return res.status(400).json({ error: 'Page 2 must have at least one component' });
    }

    if (!page3 || page3.length === 0) {
      return res.status(400).json({ error: 'Page 3 must have at least one component' });
    }

    // Updated valid components to match frontend
    const validComponents = ['about', 'address', 'birthdate'];
    const allComponents = [...page2, ...page3];
    
    for (const component of allComponents) {
      if (!validComponents.includes(component)) {
        return res.status(400).json({ 
          error: `Invalid component: ${component}. Valid components are: ${validComponents.join(', ')}` 
        });
      }
    }

    // Update or insert configuration
    const result = await pool.query(`
      UPDATE onboarding 
      SET page2 = $1, page3 = $2, updated = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM onboarding ORDER BY id DESC LIMIT 1)
      RETURNING *
    `, [page2, page3]);

    if (result.rows.length === 0) {
      // If no config exists, create one
      const insertResult = await pool.query(`
        INSERT INTO onboarding (page2, page3)
        VALUES ($1, $2)
        RETURNING *
      `, [page2, page3]);
      
      return res.json({ success: true, config: insertResult.rows[0] });
    }
    
    res.json({ success: true, config: result.rows[0] });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;