// backend/routes/orders.js
const express = require('express');
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/orders
 * - admin  ⇒ every order
 * - user   ⇒ just their orders
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const query = req.user.isAdmin
      ? 'SELECT * FROM orders ORDER BY created_at DESC'
      : 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';

    const params = req.user.isAdmin ? [] : [req.user.userId];
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('List orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id/items
 * - user may only read their own order (or admin)
 */
router.get('/:id/items', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    // authorise
    if (!req.user.isAdmin) {
      const { rows: ownerRows } = await pool.query(
        'SELECT user_id FROM orders WHERE id = $1',
        [id]
      );
      if (ownerRows.length === 0) return res.status(404).json({ error: 'Order not found' });
      if (ownerRows[0].user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const { rows } = await pool.query(
      `SELECT oi.*, p.name, p.price
         FROM order_items oi
         JOIN parts p ON p.id = oi.part_id
        WHERE oi.order_id = $1`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch order items error:', err);
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
});

/**
 * PATCH /api/orders/:id   { status }
 * - admin only
 */
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ALLOWED = ['pending', 'paid', 'shipped', 'cancelled'];

  if (!ALLOWED.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${ALLOWED.join(', ')}` });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;

