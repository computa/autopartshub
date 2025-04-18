const express = require('express');
const parts = require('../data/parts.json');
const router = express.Router();

// GET /api/search?q=&make=&model=&year=&partNumber=
router.get('/search', (req, res) => {
  const { q = '', make, model, year, partNumber } = req.query;
  let results = parts;

  // if they supplied partNumber, only match on that
  if (partNumber) {
    const pn = partNumber.toLowerCase();
    results = results.filter(p =>
      p.partNumber && p.partNumber.toLowerCase().includes(pn)
    );
  } else {
    // otherwise fall back to your original name‐based search
    const ql = q.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(ql)
    );
    if (make)  results = results.filter(p => p.make === make);
    if (model) results = results.filter(p => p.model === model);
    if (year)  results = results.filter(p => String(p.year) === year);
  }

  res.json(results);
});

module.exports = router;

