import pool from '../config/database.js';

// Create new social media link
export const createSocialMedia = async (platformName, url, iconName = null, displayOrder = 0) => {
  const result = await pool.query(
    'INSERT INTO social_media (platform_name, url, icon_name, display_order, is_active) VALUES ($1, $2, $3, $4, TRUE) RETURNING id',
    [platformName, url, iconName, displayOrder]
  );
  return result.rows[0].id;
};

// Get all active social media links
export const getAllSocialMedia = async () => {
  const result = await pool.query(
    'SELECT * FROM social_media WHERE is_active = TRUE ORDER BY display_order ASC'
  );
  return result.rows;
};

// Get all social media links (including inactive)
export const getAllSocialMediaAdmin = async () => {
  const result = await pool.query(
    'SELECT * FROM social_media ORDER BY display_order ASC'
  );
  return result.rows;
};

// Get social media by ID
export const getSocialMediaById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM social_media WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Update social media
export const updateSocialMedia = async (id, platformName, url, iconName = null, displayOrder = null) => {
  const updateFields = ['platform_name = $1', 'url = $2'];
  const params = [platformName, url];
  let paramCounter = 3;

  if (iconName !== null) {
    updateFields.push(`icon_name = $${paramCounter++}`);
    params.push(iconName);
  }

  if (displayOrder !== null) {
    updateFields.push(`display_order = $${paramCounter++}`);
    params.push(displayOrder);
  }

  params.push(id);

  const query = `UPDATE social_media SET ${updateFields.join(', ')} WHERE id = $${paramCounter}`;
  const result = await pool.query(query, params);

  return result.rowCount > 0;
};

// Delete social media (soft delete)
export const deleteSocialMedia = async (id) => {
  const result = await pool.query(
    'UPDATE social_media SET is_active = FALSE WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
};

// Restore social media
export const restoreSocialMedia = async (id) => {
  const result = await pool.query(
    'UPDATE social_media SET is_active = TRUE WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
};

// Check if platform name exists
export const platformNameExists = async (platformName, excludeId = null) => {
  let query = 'SELECT COUNT(*) as count FROM social_media WHERE platform_name = $1';
  const params = [platformName];

  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count) > 0;
};
