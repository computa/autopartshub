const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/carts
// → [ { id, user_id, created_at }, … ]
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Failed to retrieve carts' });
  }
});

// POST /api/carts
// → { id, user_id, created_at }
router.post('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [req.user.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

// POST /api/carts/:cartId/items
// body: { partId, quantity }
router.post('/:cartId/items', requireAuth, async (req, res) => {
  const { cartId } = req.params;
  const { partId, quantity } = req.body;
  try {
    // optionally enforce cart ownership here
    const { rows } = await pool.query(
      `INSERT INTO cart_items (cart_id, part_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, part_id) DO UPDATE
         SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cartId, partId, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(400).json({ error: err.detail || 'Failed to add item' });
  }
});

module.exports = router;

