/* backend/routes/carts.js */
const express = require('express');
const pool    = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* ————— create empty cart ————— */
router.post('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
    [req.user.userId]
  );
  res.status(201).json(rows[0]);
});

/* ————— list user’s carts ————— */
router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM carts WHERE user_id = $1 ORDER BY id DESC',
    [req.user.userId]
  );
  res.json(rows);
});

/* ————— add / update an item ————— */
router.post('/:cartId/items', requireAuth, async (req, res) => {
  const { cartId } = req.params;
  const { partId, quantity } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO cart_items (cart_id, part_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (cart_id, part_id) DO UPDATE
         SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING id, cart_id, part_id, quantity, added_at`,
    [cartId, partId, quantity]
  );
  res.status(201).json(rows[0]);
});

/* ————— list items in a cart (with part details & numeric price) ————— */
router.get('/:cartId/items', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ci.*,
            p.name,
            p.price::float AS price          -- ← cast here
       FROM cart_items ci
       JOIN parts p ON p.id = ci.part_id
      WHERE ci.cart_id = $1
      ORDER BY ci.id`,
    [req.params.cartId]
  );
  res.json(rows);
});

/* ————— delete entire cart ————— */
router.delete('/:cartId', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM carts WHERE id = $1 AND user_id = $2', [
    req.params.cartId,
    req.user.userId,
  ]);
  res.json({ deleted: req.params.cartId });
});

module.exports = router;

