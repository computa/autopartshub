// backend/routes/me.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/me
router.get('/me', requireAuth, (req, res) => {
  // req.user was attached by requireAuth
  res.json({
    userId: req.user.userId,
    isAdmin: req.user.isAdmin
  });
});

module.exports = router;

