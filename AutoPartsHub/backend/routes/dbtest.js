// backend/routes/dbtest.js
const express = require('express');
const pool    = require('../db');
const router  = express.Router();

// GET /api/dbtest
// just run a simple SELECT to confirm connectivity
router.get('/dbtest', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS now');
    return res.json({ success: true, now: rows[0].now });
  } catch (err) {
    console.error('DB test failed:', err);
    return res.status(500).json({ error: 'DB test failed' });
  }
});

module.exports = router;

