const express = require('express');
const parts = require('../data/parts.json');
const router = express.Router();

// GET /api/search?partNumber=&q=&make=&model=&year=
router.get('/search', (req, res) => {
  const { partNumber, q = '', make, model, year } = req.query;

  let results = parts;

  // 1) If user provided a partNumber, only match that exactly:
  if (partNumber) {
    results = results.filter(p =>
      String(p.partNumber || p.id).toLowerCase() === partNumber.toLowerCase()
    );
    return res.json(results);
  }

  // 2) Otherwise do the free‑text + filters flow:
  if (q) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (make)  results = results.filter(p => p.make === make);
  if (model) results = results.filter(p => p.model === model);
  if (year)  results = results.filter(p => String(p.year) === year);

  res.json(results);
});

module.exports = router;

