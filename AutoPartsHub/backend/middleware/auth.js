// backend/middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware to require a valid JWT and populate req.user
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^[Bb]earer\s*/, '');
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload.userId, payload.isAdmin, etc.
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
}

// Middleware to require admin flag
function requireAdmin(req, res, next) {
  // first ensure they’re authenticated
  requireAuth(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin only' });
    }
    next();
  });
}

module.exports = {
  requireAuth,
  requireAdmin,
};

