import pool from '../config/database.js';

// Helper: extract first image src from HTML content
const extractFirstImage = (html) => {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']?([^"'> ]+)["']?/i);
  return match ? match[1] : null;
};

// Create new news (status can be provided)
export const createNews = async (title, slug, summary, content, thumbnail, categoryId, adminId, status = 'draft') => {
  const result = await pool.query(
    'INSERT INTO news (title, slug, summary, content, thumbnail, category_id, admin_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [title, slug, summary, content, thumbnail, categoryId, adminId, status]
  );
  return result.rows[0].id;
};

// Get all news with pagination and filters
export const getAllNews = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  let query = 'SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n JOIN categories c ON n.category_id = c.id WHERE 1=1';
  const params = [];
  let paramCounter = 1;

  if (filters.status) {
    query += ` AND n.status = $${paramCounter++}`;
    params.push(filters.status);
  }

  if (filters.categoryId) {
    query += ` AND n.category_id = $${paramCounter++}`;
    params.push(filters.categoryId);
  }

  if (filters.searchTerm) {
    query += ` AND (n.title ILIKE $${paramCounter} OR n.summary ILIKE $${paramCounter + 1})`;
    params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
    paramCounter += 2;
  }

  query += ` ORDER BY n.created_at DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
  params.push(limit, offset);

  const rows = await pool.query(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM news WHERE 1=1';
  const countParams = [];
  let countParamCounter = 1;

  if (filters.status) {
    countQuery += ` AND status = $${countParamCounter++}`;
    countParams.push(filters.status);
  }

  if (filters.categoryId) {
    countQuery += ` AND category_id = $${countParamCounter++}`;
    countParams.push(filters.categoryId);
  }

  if (filters.searchTerm) {
    countQuery += ` AND (title ILIKE $${countParamCounter} OR summary ILIKE $${countParamCounter + 1})`;
    countParams.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
  }

  const countRows = await pool.query(countQuery, countParams);
  const total = parseInt(countRows.rows[0].count);

  return {
    data: rows.rows,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get news by slug
export const getNewsBySlug = async (slug) => {
  const result = await pool.query(
    'SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n JOIN categories c ON n.category_id = c.id WHERE n.slug = $1 AND n.status = $2',
    [slug, 'published']
  );
  return result.rows[0] || null;
};

// Get news by ID (admin only - can see any status)
export const getNewsById = async (id) => {
  const result = await pool.query(
    'SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n JOIN categories c ON n.category_id = c.id WHERE n.id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Get published news by ID (public - only published)
export const getPublishedNewsById = async (id) => {
  const result = await pool.query(
    'SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n JOIN categories c ON n.category_id = c.id WHERE n.id = $1 AND n.status = $2',
    [id, 'published']
  );
  return result.rows[0] || null;
};

// Get latest news
export const getLatestNews = async (limit = 5) => {
  // Only published articles
  const rows = await pool.query(
    'SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n JOIN categories c ON n.category_id = c.id WHERE n.status = $1 ORDER BY n.created_at DESC LIMIT $2',
    ['published', limit]
  );

  // Populate thumbnail from content if missing
  return rows.rows.map((r) => ({
    ...r,
    thumbnail: r.thumbnail || extractFirstImage(r.content),
  }));
};

// Get breaking news (latest 1 published)
export const getBreakingNews = async () => {
  const rows = await pool.query(
    'SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n JOIN categories c ON n.category_id = c.id WHERE n.status = $1 ORDER BY n.created_at DESC LIMIT 1',
    ['published']
  );

  if (rows.rows && rows.rows.length > 0) return rows.rows[0];
  
  // Return null if no published articles
  return null;
};

// Get news by category slug
export const getNewsByCategory = async (categorySlug, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const rows = await pool.query(
    `SELECT n.*, c.name as category_name, c.slug as category_slug FROM news n 
     JOIN categories c ON n.category_id = c.id 
     WHERE c.slug = $1 AND n.status = $2
     ORDER BY n.created_at DESC LIMIT $3 OFFSET $4`,
    [categorySlug, 'published', limit, offset]
  );

  // Get total count
  const countRows = await pool.query(
    'SELECT COUNT(*) as count FROM news n JOIN categories c ON n.category_id = c.id WHERE c.slug = $1 AND n.status = $2',
    [categorySlug, 'published']
  );

  const total = parseInt(countRows.rows[0].count);

  return {
    data: rows.rows,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Update news
export const updateNews = async (id, title, slug, summary, content, thumbnail, categoryId) => {
  const result = await pool.query(
    `UPDATE news SET title = $1, slug = $2, summary = $3, content = $4, thumbnail = $5, category_id = $6, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $7`,
    [title, slug, summary, content, thumbnail, categoryId, id]
  );
  return result.rowCount > 0;
};

// Update news status
export const updateNewsStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE news SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [status, id]
  );
  return result.rowCount > 0;
};

// Delete news
export const deleteNews = async (id) => {
  const result = await pool.query('DELETE FROM news WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// Increment views
export const incrementViews = async (id) => {
  const result = await pool.query('UPDATE news SET views = views + 1 WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// Check if slug exists
export const slugExists = async (slug, excludeId = null) => {
  let query = 'SELECT COUNT(*) as count FROM news WHERE slug = $1';
  const params = [slug];

  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count) > 0;
};

// Get news count by status
export const getNewsCountByStatus = async (status) => {
  const result = await pool.query('SELECT COUNT(*) as count FROM news WHERE status = $1', [status]);
  return parseInt(result.rows[0].count);
};

// Get total news count
export const getTotalNewsCount = async () => {
  const result = await pool.query('SELECT COUNT(*) as count FROM news');
  return parseInt(result.rows[0].count);
};

// Get total views
export const getTotalViews = async () => {
  const result = await pool.query('SELECT SUM(views) as total FROM news');
  return result.rows[0].total || 0;
};
