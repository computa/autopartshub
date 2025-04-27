/* backend/routes/parts.js */
const express = require('express');
const pool    = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* ─────────── public GET /api/parts ─────────── */
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id,
             name,
             description,
             price::float      AS price,   -- ← cast here
             img_url,
             created_at
      FROM   parts
      ORDER  BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /parts failed:', err);
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
});

/* ─────────── POST /api/parts  (admin only) ─────────── */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, price, img_url } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO parts (name, description, price, img_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, price::float AS price, img_url, created_at`,
      [name, description, price, img_url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /parts failed:', err);
    res.status(400).json({ error: err.detail || 'Failed to create part' });
  }
});

/* ─────────── DELETE /api/parts/:id  (admin only) ─────────── */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM parts WHERE id = $1', [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (err) {
    console.error('DELETE /parts failed:', err);
    res.status(400).json({ error: 'Failed to delete part' });
  }
});

module.exports = router;

