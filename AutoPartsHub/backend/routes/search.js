const express = require('express');
const parts   = require('../data/parts.json');
const router  = express.Router();

// GET /api/search?q=&make=&model=&year=
router.get('/search', (req, res) => {
  const {
    q     = '',
    make  = '',
    model = '',
    year
  } = req.query;

  const results = parts.filter(p => {
    return (
      // name match
      p.name.toLowerCase().includes(q.toLowerCase()) &&

      // make/model (if provided)
      (!make  || p.make.toLowerCase()  === make.toLowerCase()) &&
      (!model || p.model.toLowerCase() === model.toLowerCase()) &&

      // year (if provided)
      (!year  || p.year === parseInt(year, 10))
    );
  });

  res.json(results);
});

module.exports = router;

