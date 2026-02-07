import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateLoginRequest, validateChangePasswordRequest } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/login', authLimiter, validateLoginRequest, authController.login);

// Protected routes
router.put('/change-email', verifyToken, authController.changeEmail);
router.put('/change-password', verifyToken, validateChangePasswordRequest, authController.changePassword);

export default router;
