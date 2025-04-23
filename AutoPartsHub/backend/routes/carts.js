const express      = require('express');
const pool         = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* ────────────────────────────────────────────────────────────── *
 * GET  /api/carts               – list all carts for this user  *
 * POST /api/carts               – create a new empty cart       *
 * GET  /api/carts/:id/items     – list items in a cart          *
 * POST /api/carts/:id/items     – add / increment an item       *
 * ────────────────────────────────────────────────────────────── */

// all carts belonging to the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('fetch-carts error:', err);
    res.status(500).json({ error: 'Failed to retrieve carts' });
  }
});

// create a fresh cart
router.post('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [req.user.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('create-cart error:', err);
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

// list items in a cart
router.get('/:cartId/items', requireAuth, async (req, res) => {
  const { cartId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT ci.*, p.name, p.price
         FROM cart_items ci
         JOIN parts p ON p.id = ci.part_id
        WHERE ci.cart_id = $1`,
      [cartId]
    );
    res.json(rows);
  } catch (err) {
    console.error('fetch-cart-items error:', err);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
});

// add / increment an item
router.post('/:cartId/items', requireAuth, async (req, res) => {
  const { cartId }          = req.params;
  const { partId, quantity } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO cart_items (cart_id, part_id, quantity)
         VALUES ($1,$2,$3)
         ON CONFLICT (cart_id, part_id) DO UPDATE
           SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cartId, partId, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('add-to-cart error:', err);
    res.status(400).json({ error: err.detail || 'Failed to add item' });
  }
});

module.exports = router;

