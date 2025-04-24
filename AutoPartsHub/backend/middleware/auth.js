// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [bearer, token] = auth.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
}

module.exports = { requireAuth, requireAdmin };

