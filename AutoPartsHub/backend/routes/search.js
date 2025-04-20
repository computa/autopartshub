// backend/routes/search.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/search?q=&make=&model=&year=&partNumber=
router.get('/search', async (req, res) => {
  const { q = '', make, model, year, partNumber } = req.query;
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }
  if (make) {
    values.push(make);
    conditions.push(`make = $${values.length}`);
  }
  if (model) {
    values.push(model);
    conditions.push(`model = $${values.length}`);
  }
  if (year) {
    values.push(year);
    conditions.push(`year = $${values.length}`);
  }
  if (partNumber) {
    values.push(partNumber);
    conditions.push(`part_number = $${values.length}`);
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const text = `
    SELECT
      id, name, make, model, year, price,
      part_number AS "partNumber", image
    FROM parts
    ${where}
    ORDER BY id
  `;
  try {
    const { rows } = await db.query(text, values);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;

