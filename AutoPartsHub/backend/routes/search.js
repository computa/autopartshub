const express = require('express');
const parts   = require('../data/parts.json');
const router  = express.Router();

// GET /api/search?q=&make=&model=&year=&partNumber=
router.get('/search', (req, res) => {
  const { q = '', make, model, year, partNumber } = req.query;

  let results = parts.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  if (make)       results = results.filter(p => p.make === make);
  if (model)      results = results.filter(p => p.model === model);
  if (year)       results = results.filter(p => String(p.year) === year);
  if (partNumber) results = results.filter(p => p.partNumber === partNumber);

  // add this to debug:
  console.log('Searching for partNumber=', partNumber, 'found', results.length);

  res.json(results);
});

module.exports = router;

