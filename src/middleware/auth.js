// src/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user payload to req.user
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Admin authentication middleware
 * Requires user to be authenticated AND have admin privileges
 */
export const requireAdmin = (req, res, next) => {
  try {
    // First authenticate
    authenticateToken(req, res, () => {
      // Then check admin status
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin privileges required' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

export default authenticateToken;
