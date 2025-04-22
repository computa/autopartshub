// AutoPartsHub/backend/routes/orders.js
const express = require('express');
const pool   = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/orders → [ { id, user_id, status, total, created_at } ]
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, status, total, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders → { id, user_id, status, total, created_at }
router.post('/', requireAuth, async (req, res) => {
  const { total } = req.body;  // in a real app you'd calculate this
  try {
    const { rows } = await pool.query(
      `INSERT INTO orders (user_id, total)
       VALUES ($1, $2)
       RETURNING id, user_id, status, total, created_at`,
      [req.user.userId, total]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(400).json({ error: 'Failed to create order' });
  }
});

module.exports = router;

