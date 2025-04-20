// backend/routes/parts.js

const express = require('express');
const pool = require('../db');                 // your pg Pool instance
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/parts
// → [ { id, name, make, model, year, price, partNumber, image }, … ]
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        make,
        model,
        year,
        price,
        part_number AS "partNumber",
        image
      FROM parts
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching parts:', err);
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
});

// GET /api/parts/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        name,
        make,
        model,
        year,
        price,
        part_number AS "partNumber",
        image
      FROM parts
      WHERE id = $1
      `, 
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Part not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching part:', err);
    res.status(500).json({ error: 'Failed to fetch part' });
  }
});

// POST /api/parts   (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, make, model, year, price, partNumber, image } = req.body;
    const { rows } = await pool.query(
      `
      INSERT INTO parts
        (name, make, model, year, price, part_number, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        make,
        model,
        year,
        price,
        part_number AS "partNumber",
        image
      `,
      [name, make, model, year, price, partNumber, image]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating part:', err);
    res.status(400).json({ error: err.detail || 'Failed to create part' });
  }
});

// DELETE /api/parts/:id  (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM parts WHERE id = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Part not found' });
    res.json({ deleted: Number(req.params.id) });
  } catch (err) {
    console.error('Error deleting part:', err);
    res.status(500).json({ error: 'Failed to delete part' });
  }
});

module.exports = router;

