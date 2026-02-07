import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as AdminModel from '../models/Admin.js';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';

// Login service
export const loginAdmin = async (identifier, password) => {
  // Validate inputs
  if (!identifier || !password) {
    throw new Error('Identifier (email or username) and password are required');
  }

  // Try by email first, then username
  let admin = await AdminModel.getAdminByEmail(identifier);
  if (!admin) {
    admin = await AdminModel.getAdminByUsername(identifier);
  }
  if (!admin) {
    throw new Error('Invalid credentials');
  }

  if (!admin.is_active) {
    throw new Error('Admin account is inactive');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign(
    { id: admin.id, username: admin.username, email: admin.email },
    process.env.JWT_SECRET || 'your_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
    },
  };
};

// Change password service
export const changePassword = async (adminId, oldPassword, newPassword) => {
  // Validate inputs
  if (!oldPassword || !newPassword) {
    throw new Error('Old and new passwords are required');
  }

  if (!validatePassword(newPassword)) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (oldPassword === newPassword) {
    throw new Error('New password must be different from old password');
  }

  // Get admin
  const admin = await AdminModel.getAdminById(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  // Verify old password
  const adminFull = await AdminModel.getAdminByUsername(admin.username);
  const isPasswordValid = await bcrypt.compare(oldPassword, adminFull.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  const updated = await AdminModel.updateAdminPassword(adminId, hashedPassword);
  if (!updated) {
    throw new Error('Failed to update password');
  }

  return true;
};
