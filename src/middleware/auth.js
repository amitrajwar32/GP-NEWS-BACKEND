import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

// JWT Authentication middleware
export const verifyToken = (req, res, next) => {
  // Support multiple token sources for compatibility with various frontends
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const headerToken = req.headers['x-access-token'] || req.headers['x-auth-token'];
  const queryToken = req.query?.token;

  // Parse cookies header (if frontend sends token in cookie)
  let cookieToken = null;
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const c of cookies) {
      const [k, v] = c.split('=');
      if (k === 'token' || k === 'jwt') {
        cookieToken = decodeURIComponent(v);
        break;
      }
    }
  }

  const token = bearerToken || headerToken || queryToken || cookieToken;

  if (!token) {
    return sendError(res, 'No token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      req.user = decoded;
    } catch (error) {
      // Token is invalid but we don't fail
    }
  }

  next();
};
