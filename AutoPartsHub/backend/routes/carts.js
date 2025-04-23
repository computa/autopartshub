// backend/routes/carts.js
const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// POST /api/carts/:cartId/items
// body: { partId, quantity }
router.post('/:cartId/items', requireAuth, async (req, res) => {
  const { cartId } = req.params;
  const { partId, quantity } = req.body;
  try {
    // optionally you might check that req.user.userId owns this cart
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

