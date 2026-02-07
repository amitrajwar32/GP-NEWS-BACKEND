import pool from '../config/database.js';

// Get all settings
export const getAllSettings = async () => {
  const result = await pool.query('SELECT * FROM site_settings ORDER BY setting_key ASC');
  return result.rows;
};

// Get setting by key
export const getSettingByKey = async (key) => {
  const result = await pool.query('SELECT * FROM site_settings WHERE setting_key = $1', [key]);
  return result.rows[0] || null;
};

// Update or create setting
export const upsertSetting = async (key, value, description = null) => {
  // Check if exists
  const existing = await getSettingByKey(key);
  
  if (existing) {
    const result = await pool.query(
      'UPDATE site_settings SET setting_value = $1 WHERE setting_key = $2',
      [value, key]
    );
    return result.rowCount > 0;
  } else {
    const result = await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value, description) VALUES ($1, $2, $3) RETURNING id',
      [key, value, description]
    );
    return result.rows[0].id;
  }
};

// Delete setting
export const deleteSetting = async (key) => {
  const result = await pool.query(
    'DELETE FROM site_settings WHERE setting_key = $1',
    [key]
  );
  return result.rowCount > 0;
};
