const express         = require('express');
const pool            = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/*  POST /api/orders   { cartId }
    – converts a cart to an order, copies lines, empties cart
*/
router.post('/', requireAuth, async (req, res) => {
  const { cartId } = req.body;

  try {
    await pool.query('BEGIN');

    // pull cart lines & total
    const lines = await pool.query(
      `SELECT ci.*, p.price
         FROM cart_items ci
         JOIN parts p ON p.id = ci.part_id
        WHERE ci.cart_id = $1`,
      [cartId]
    );
    if (lines.rowCount === 0) throw new Error('Cart is empty');

    const total = lines.rows.reduce(
      (sum, l) => sum + Number(l.price) * l.quantity,
      0
    );

    // create order
    const order = await pool.query(
      `INSERT INTO orders (user_id, total)
       VALUES ($1,$2) RETURNING *`,
      [req.user.userId, total]
    );

    // copy lines
    const promises = lines.rows.map(l =>
      pool.query(
        `INSERT INTO order_items
           (order_id, part_id, quantity, price_at_purchase)
         VALUES ($1,$2,$3,$4)`,
        [order.rows[0].id, l.part_id, l.quantity, l.price]
      )
    );
    await Promise.all(promises);

    // empty cart
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    await pool.query('COMMIT');
    res.status(201).json(order.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('create-order error:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

