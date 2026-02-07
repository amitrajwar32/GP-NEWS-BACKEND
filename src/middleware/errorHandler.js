import { sendError } from '../utils/response.js';

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return sendError(res, 'Validation Error', 400, err.details);
  }

  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Unauthorized', 401);
  }

  if (err.name === 'NotFoundError') {
    return sendError(res, 'Not Found', 404);
  }

  sendError(res, message, statusCode);
};

// 404 handler
export const notFoundHandler = (req, res) => {
  sendError(res, 'Route not found', 404);
};
