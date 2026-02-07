import pool from '../config/database.js';

// Create new category
export const createCategory = async (name, slug, description = '') => {
  const result = await pool.query(
    'INSERT INTO categories (name, slug, description, is_active) VALUES ($1, $2, $3, TRUE) RETURNING id',
    [name, slug, description]
  );
  return result.rows[0].id;
};

// Get all categories
export const getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM categories WHERE is_active = TRUE ORDER BY name ASC');
  return result.rows;
};

// Get category by ID
export const getCategoryById = async (id) => {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1 AND is_active = TRUE', [id]);
  return result.rows[0] || null;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const result = await pool.query('SELECT * FROM categories WHERE slug = $1 AND is_active = TRUE', [slug]);
  return result.rows[0] || null;
};

// Check if category name exists
export const categoryNameExists = async (name, excludeId = null) => {
  let query = 'SELECT COUNT(*) as count FROM categories WHERE name = $1';
  const params = [name];
  
  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }
  
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count) > 0;
};

// Check if category slug exists
export const categorySlugExists = async (slug, excludeId = null) => {
  let query = 'SELECT COUNT(*) as count FROM categories WHERE slug = $1';
  const params = [slug];
  
  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }
  
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count) > 0;
};

// Update category
export const updateCategory = async (id, name, slug, description) => {
  const result = await pool.query(
    'UPDATE categories SET name = $1, slug = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
    [name, slug, description, id]
  );
  return result.rowCount > 0;
};

// Delete category
export const deleteCategory = async (id) => {
  const result = await pool.query('UPDATE categories SET is_active = FALSE WHERE id = $1', [id]);
  return result.rowCount > 0;
};
