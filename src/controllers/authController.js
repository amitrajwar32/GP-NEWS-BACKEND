import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Login controller
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Allow login with either username or email for compatibility
    const identifier = username || email;

    const result = await authService.loginAdmin(identifier, password);

    sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    logger.error('Login error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Change password controller
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user.id;

    await authService.changePassword(adminId, oldPassword, newPassword);

    sendSuccess(res, {}, 'Password changed successfully', 200);
  } catch (error) {
    logger.error('Change password error:', error.message);
    sendError(res, error.message, 400);
  }
};
