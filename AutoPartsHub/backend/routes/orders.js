/* backend/routes/orders.js */
const express = require('express');
const pool    = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* ————— create order from cart ————— */
router.post('/', requireAuth, async (req, res) => {
  const { cartId } = req.body;

  // 1. copy items & calc total
  const { rows: totalRows } = await pool.query(
    `SELECT SUM(ci.quantity * p.price)::float AS total   -- cast here
       FROM cart_items ci
       JOIN parts p ON p.id = ci.part_id
      WHERE ci.cart_id = $1`,
    [cartId]
  );
  const total = totalRows[0].total;
  if (!total) return res.status(400).json({ error: 'Cart is empty' });

  // 2. create order
  const { rows: orderRows } = await pool.query(
    `INSERT INTO orders (user_id, total)
     VALUES ($1,$2) RETURNING *`,
    [req.user.userId, total]
  );
  const order = orderRows[0];

  // 3. move items
  await pool.query(
    `INSERT INTO order_items (order_id, part_id, quantity, price_at_purchase)
       SELECT $1, ci.part_id, ci.quantity, p.price
         FROM cart_items ci
         JOIN parts p ON p.id = ci.part_id
        WHERE ci.cart_id = $2`,
    [order.id, cartId]
  );

  // 4. clear cart
  await pool.query('DELETE FROM carts WHERE id = $1', [cartId]);

  res.status(201).json(order);
});

/* ————— list orders (admin sees all, user sees own) ————— */
router.get('/', requireAuth, async (req, res) => {
  const q =
    req.user.isAdmin
      ? 'SELECT * FROM orders ORDER BY id DESC'
      : 'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC';
  const { rows } = await pool.query(q, req.user.isAdmin ? [] : [req.user.userId]);
  // ensure numeric total
  rows.forEach(r => (r.total = Number(r.total)));
  res.json(rows);
});

/* ————— list items in one order ————— */
router.get('/:orderId/items', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT oi.*,
            p.name,
            p.price::float AS price          -- ← cast here
       FROM order_items oi
       JOIN parts p ON p.id = oi.part_id
      WHERE oi.order_id = $1`,
    [req.params.orderId]
  );
  res.json(rows);
});

/* ————— admin patch status ————— */
router.patch('/:orderId', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const { rows } = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, req.params.orderId]
  );
  rows[0].total = Number(rows[0].total);
  res.json(rows[0]);
});

module.exports = router;

