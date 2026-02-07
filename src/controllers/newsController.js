import * as newsService from '../services/newsService.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Create news controller
export const createNews = async (req, res) => {
  try {
    const { title, summary, content, categoryId, thumbnail } = req.body;
    const adminId = req.user.id;

    const news = await newsService.createNewsService(title, summary, content, categoryId, adminId, thumbnail);

    sendSuccess(res, news, 'News created successfully', 201);
  } catch (error) {
    logger.error('Create news error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Get all news controller (admin)
export const getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const categoryId = req.query.categoryId;
    const searchTerm = req.query.search;

    const filters = {};
    if (status) filters.status = status;
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (searchTerm) filters.searchTerm = searchTerm;

    const result = await newsService.getAllNewsService(page, limit, filters);

    sendPaginated(res, result.data, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    }, 'News retrieved successfully', 200);
  } catch (error) {
    logger.error('Get all news error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get latest news (public)
export const getLatestNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const news = await newsService.getLatestNewsService(limit);

    sendSuccess(res, news, 'Latest news retrieved successfully', 200);
  } catch (error) {
    logger.error('Get latest news error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get breaking news (public)
export const getBreakingNews = async (req, res) => {
  try {
    const news = await newsService.getBreakingNewsService();

    if (!news) {
      return sendSuccess(res, null, 'No breaking news available', 200);
    }

    sendSuccess(res, news, 'Breaking news retrieved successfully', 200);
  } catch (error) {
    logger.error('Get breaking news error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get news by slug (public)
export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const news = await newsService.getNewsBySlugService(slug);

    sendSuccess(res, news, 'News retrieved successfully', 200);
  } catch (error) {
    logger.error('Get news by slug error:', error.message);
    sendError(res, error.message, 404);
  }
};

// Get news by category (public)
export const getNewsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await newsService.getNewsByCategoryService(slug, page, limit);

    sendPaginated(res, result.data, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    }, 'Category news retrieved successfully', 200);
  } catch (error) {
    logger.error('Get news by category error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Update news controller (admin)
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, categoryId, thumbnail } = req.body;

    const news = await newsService.updateNewsService(id, title, summary, content, categoryId, thumbnail);

    sendSuccess(res, news, 'News updated successfully', 200);
  } catch (error) {
    logger.error('Update news error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Update news status controller (admin)
export const updateNewsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await newsService.updateNewsStatusService(id, status);

    sendSuccess(res, {}, 'News status updated successfully', 200);
  } catch (error) {
    logger.error('Update news status error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Delete news controller (admin)
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    await newsService.deleteNewsService(id);

    sendSuccess(res, {}, 'News deleted successfully', 200);
  } catch (error) {
    logger.error('Delete news error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Get dashboard stats (admin)
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await newsService.getDashboardStats();

    sendSuccess(res, stats, 'Dashboard stats retrieved successfully', 200);
  } catch (error) {
    logger.error('Get dashboard stats error:', error.message);
    sendError(res, error.message, 500);
  }
};
