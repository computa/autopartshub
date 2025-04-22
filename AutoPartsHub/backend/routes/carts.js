// AutoPartsHub/backend/routes/carts.js
const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/carts → [ { id, user_id, created_at } ]
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, created_at FROM carts WHERE user_id = $1`,
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Failed to fetch carts' });
  }
});

// POST /api/carts → { id, user_id, created_at }
router.post('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO carts (user_id) VALUES ($1) RETURNING id, user_id, created_at`,
      [req.user.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(400).json({ error: 'Failed to create cart' });
  }
});

module.exports = router;

