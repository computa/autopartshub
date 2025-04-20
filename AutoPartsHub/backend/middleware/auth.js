// backend/middleware/auth.js

require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * requireAuth
 *  - Verifies the JWT from the Authorization header
 *  - On success, attaches the payload to req.user and calls next()
 *  - On failure, responds 401 Unauthorized
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^[Bb]earer\s*/, '');

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload should contain e.g. { userId: 1, isAdmin: true, iat: ..., exp: ... }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
}

/**
 * requireAdmin
 *  - First runs requireAuth to ensure the user is logged in
 *  - Then checks req.user.isAdmin flag
 *  - If not an admin, responds 403 Forbidden
 */
function requireAdmin(req, res, next) {
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

