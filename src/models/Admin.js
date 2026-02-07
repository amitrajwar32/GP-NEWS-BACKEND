import pool from '../config/database.js';

// Get admin by ID
export const getAdminById = async (id) => {
  const result = await pool.query('SELECT id, username, email, is_active FROM admins WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Get admin by email
export const getAdminByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
  return result.rows[0] || null;
};

// Get admin by username (kept for backward compatibility)
export const getAdminByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  return result.rows[0] || null;
};

// Update admin password
export const updateAdminPassword = async (id, hashedPassword) => {
  const result = await pool.query('UPDATE admins SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, id]);
  return result.rowCount > 0;
};

// Update admin email
export const updateAdminEmail = async (id, email) => {
  const result = await pool.query('UPDATE admins SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [email, id]);
  return result.rowCount > 0;
};

// Get admin count
export const getAdminCount = async () => {
  const result = await pool.query('SELECT COUNT(*) as count FROM admins WHERE is_active = TRUE');
  return parseInt(result.rows[0].count);
};
