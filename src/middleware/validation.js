import { sendError } from '../utils/response.js';
import { validateEmail } from '../utils/validators.js';

// Validate login request
export const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return sendError(res, 'Email and password must be strings', 400);
  }

  next();
};

// Validate change password request
export const validateChangePasswordRequest = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return sendError(res, 'Old and new passwords are required', 400);
  }

  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    return sendError(res, 'Passwords must be strings', 400);
  }

  if (newPassword.length < 6) {
    return sendError(res, 'New password must be at least 6 characters', 400);
  }

  next();
};

// Validate create category request
export const validateCreateCategoryRequest = (req, res, next) => {
  const { name, description } = req.body;

  if (!name || typeof name !== 'string') {
    return sendError(res, 'Category name is required and must be a string', 400);
  }

  if (name.trim().length === 0) {
    return sendError(res, 'Category name cannot be empty', 400);
  }

  next();
};

// Validate create news request (accepts both categoryId and category_id)
export const validateCreateNewsRequest = (req, res, next) => {
  const { title, summary, content } = req.body;
  // Support both camelCase and snake_case for category id
  const categoryId = req.body.categoryId || req.body.category_id;

  if (!title || typeof title !== 'string') {
    return sendError(res, 'Title is required and must be a string', 400);
  }

  if (!summary || typeof summary !== 'string') {
    return sendError(res, 'Summary is required and must be a string', 400);
  }

  if (!content || typeof content !== 'string') {
    return sendError(res, 'Content is required and must be a string', 400);
  }

  if (!categoryId || typeof categoryId !== 'number') {
    return sendError(res, 'Category ID is required and must be a number', 400);
  }

  if (title.trim().length === 0) {
    return sendError(res, 'Title cannot be empty', 400);
  }

  if (summary.trim().length === 0) {
    return sendError(res, 'Summary cannot be empty', 400);
  }

  if (content.trim().length === 0) {
    return sendError(res, 'Content cannot be empty', 400);
  }

  // attach normalized categoryId to body for downstream logic
  req.body.categoryId = categoryId;

  next();
};

// Validate contact request
export const validateContactRequest = (req, res, next) => {
  const { name, email, phone, message } = req.body;

  if (!name || typeof name !== 'string') {
    return sendError(res, 'Name is required and must be a string', 400);
  }

  if (!email || !validateEmail(email)) {
    return sendError(res, 'Valid email is required', 400);
  }

  if (!message || typeof message !== 'string') {
    return sendError(res, 'Message is required and must be a string', 400);
  }

  if (name.trim().length === 0) {
    return sendError(res, 'Name cannot be empty', 400);
  }

  if (message.trim().length === 0) {
    return sendError(res, 'Message cannot be empty', 400);
  }

  next();
};
