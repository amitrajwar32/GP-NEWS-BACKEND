import pool from '../config/database.js';

// Save contact message
export const saveContact = async (name, email, phone, message) => {
  const result = await pool.query(
    'INSERT INTO contacts (name, email, phone, message, is_read) VALUES ($1, $2, $3, $4, FALSE) RETURNING id',
    [name, email, phone, message]
  );
  return result.rows[0].id;
};

// Get all contacts
export const getAllContacts = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const rows = await pool.query(
    'SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const countRows = await pool.query('SELECT COUNT(*) as count FROM contacts');
  const total = parseInt(countRows.rows[0].count);

  return {
    data: rows.rows,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

// Get contact by ID
export const getContactById = async (id) => {
  const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Mark as read
export const markAsRead = async (id) => {
  const result = await pool.query('UPDATE contacts SET is_read = TRUE WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// Delete contact
export const deleteContact = async (id) => {
  const result = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// Get unread count
export const getUnreadCount = async () => {
  const result = await pool.query('SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE');
  return parseInt(result.rows[0].count);
};
