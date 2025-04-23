const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/orders    body: { cartId }
 *
 * - creates an order from the specified cart
 * - copies cart_items → order_items
 * - calculates total
 * - empties the cart
 */
router.post('/', requireAuth, async (req, res) => {
  const { cartId } = req.body;
  if (!cartId) {
    return res.status(400).json({ error: 'cartId required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    /* 1️⃣  grab the cart lines + prices */
    const { rows: cartLines } = await client.query(
      `SELECT ci.part_id,
              ci.quantity,
              p.price::numeric            -- ensure numeric for math
       FROM   cart_items ci
       JOIN   parts p ON p.id = ci.part_id
       WHERE  ci.cart_id = $1`,
      [cartId]
    );

    if (cartLines.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    /* 2️⃣  compute total */
    const total = cartLines.reduce(
      (sum, l) => sum + Number(l.price) * l.quantity,
      0
    );

    /* 3️⃣  create the order, capture its id */
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.userId, total.toFixed(2)]
    );
    const orderId = order.id;

    /* 4️⃣  bulk-insert the order_items */
    // Build `( $1, $2, $3, $4 ), ( $1, $5, $6, $7 ), …`
    const valueBlocks = cartLines
      .map((_, i) => `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`)
      .join(', ');

    const params = [orderId];
    cartLines.forEach(l => {
      params.push(l.part_id, l.quantity, l.price);
    });

    await client.query(
      `INSERT INTO order_items
       (order_id, part_id, quantity, price_at_purchase)
       VALUES ${valueBlocks}`,
      params
    );

    /* 5️⃣  empty the cart */
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    await client.query('COMMIT');
    res.status(201).json(order);          // return the new order 👍
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('create-order error:', err);
    res.status(400).json({
      error: err.detail || 'Failed to create order'
    });
  } finally {
    client.release();
  }
});

module.exports = router;

