// backend/routes/carts.js
const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* ---------- existing endpoints (list, create, add item) ---------- */

// GET /api/carts  – list my carts
router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM carts WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.userId]
  );
  res.json(rows);
});

// POST /api/carts  – create new cart
router.post('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
    [req.user.userId]
  );
  res.status(201).json(rows[0]);
});

// POST /api/carts/:cartId/items  – add / increment line-item
router.post('/:cartId/items', requireAuth, async (req, res) => {
  const { cartId } = req.params;
  const { partId, quantity } = req.body;

  try {
    await pool.query('BEGIN');

    // ensure the caller owns the cart (unless admin)
    if (!req.user.isAdmin) {
      const { rows: own } = await pool.query(
        'SELECT 1 FROM carts WHERE id = $1 AND user_id = $2',
        [cartId, req.user.userId]
      );
      if (own.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO cart_items (cart_id, part_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (cart_id, part_id) DO UPDATE
         SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cartId, partId, quantity]
    );
    await pool.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Add to cart error:', err);
    res.status(400).json({ error: err.detail || 'Failed to add item' });
  }
});

// GET /api/carts/:cartId/items  – list items in a cart
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
    console.error('Get cart items error:', err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

/* ----------  NEW  ----------  */
// DELETE /api/carts/:cartId  – remove a cart I own (or admin)
router.delete('/:cartId', requireAuth, async (req, res) => {
  const { cartId } = req.params;
  try {
    await pool.query('BEGIN');

    // authorise
    if (!req.user.isAdmin) {
      const { rows: check } = await pool.query(
        'SELECT 1 FROM carts WHERE id = $1 AND user_id = $2',
        [cartId, req.user.userId]
      );
      if (check.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    const { rows } = await pool.query(
      'DELETE FROM carts WHERE id = $1 RETURNING *',
      [cartId]
    );
    await pool.query('COMMIT');

    if (rows.length === 0) return res.status(404).json({ error: 'Cart not found' });
    res.json({ deleted: cartId });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Delete cart error:', err);
    res.status(500).json({ error: 'Failed to delete cart' });
  }
});

module.exports = router;

