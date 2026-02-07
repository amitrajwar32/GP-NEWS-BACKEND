import * as NewsModel from '../models/News.js';
import * as CategoryModel from '../models/Category.js';
import { slugify } from '../utils/helpers.js';

// Create news service
export const createNewsService = async (title, summary, content, categoryId, adminId, thumbnail = '') => {
  if (!title || !summary || !content || !categoryId) {
    throw new Error('Title, summary, content, and category are required');
  }

  // Check if category exists
  const category = await CategoryModel.getCategoryById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  const slug = slugify(title);

  // Check if slug already exists
  const slugAlreadyExists = await NewsModel.slugExists(slug);
  if (slugAlreadyExists) {
    throw new Error('Slug already exists');
  }

  const newsId = await NewsModel.createNews(title, slug, summary, content, thumbnail, categoryId, adminId);
  return {
    id: newsId,
    title,
    slug,
    summary,
    content,
    thumbnail,
    categoryId,
  };
};

// Get all news service
export const getAllNewsService = async (page = 1, limit = 10, filters = {}) => {
  const result = await NewsModel.getAllNews(page, limit, filters);
  return result;
};

// Get news by slug service
export const getNewsBySlugService = async (slug) => {
  const news = await NewsModel.getNewsBySlug(slug);
  if (!news) {
    throw new Error('News not found');
  }

  // Increment views
  await NewsModel.incrementViews(news.id);
  news.views += 1;

  return news;
};

// Get breaking news
export const getBreakingNewsService = async () => {
  const news = await NewsModel.getBreakingNews();
  return news;
};

// Get latest news
export const getLatestNewsService = async (limit = 5) => {
  const news = await NewsModel.getLatestNews(limit);
  return news;
};

// Get news by category service
export const getNewsByCategoryService = async (categorySlug, page = 1, limit = 10) => {
  const result = await NewsModel.getNewsByCategory(categorySlug, page, limit);
  return result;
};

// Update news service
export const updateNewsService = async (id, title, summary, content, categoryId, thumbnail = '') => {
  if (!title || !summary || !content || !categoryId) {
    throw new Error('Title, summary, content, and category are required');
  }

  const news = await NewsModel.getNewsById(id);
  if (!news) {
    throw new Error('News not found');
  }

  // Check if category exists
  const category = await CategoryModel.getCategoryById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  const slug = slugify(title);

  // Check if slug already exists (excluding current news)
  const slugAlreadyExists = await NewsModel.slugExists(slug, id);
  if (slugAlreadyExists) {
    throw new Error('Slug already exists');
  }

  const finalThumbnail = thumbnail || news.thumbnail;

  const updated = await NewsModel.updateNews(id, title, slug, summary, content, finalThumbnail, categoryId);
  if (!updated) {
    throw new Error('Failed to update news');
  }

  return {
    id,
    title,
    slug,
    summary,
    content,
    thumbnail: finalThumbnail,
    categoryId,
  };
};

// Update news status service
export const updateNewsStatusService = async (id, status) => {
  if (!['draft', 'published', 'hidden'].includes(status)) {
    throw new Error('Invalid status');
  }

  const news = await NewsModel.getNewsById(id);
  if (!news) {
    throw new Error('News not found');
  }

  const updated = await NewsModel.updateNewsStatus(id, status);
  if (!updated) {
    throw new Error('Failed to update news status');
  }

  return true;
};

// Delete news service
export const deleteNewsService = async (id) => {
  const news = await NewsModel.getNewsById(id);
  if (!news) {
    throw new Error('News not found');
  }

  const deleted = await NewsModel.deleteNews(id);
  if (!deleted) {
    throw new Error('Failed to delete news');
  }

  return true;
};

// Get dashboard stats
export const getDashboardStats = async () => {
  const totalNews = await NewsModel.getTotalNewsCount();
  const publishedNews = await NewsModel.getNewsCountByStatus('published');
  const draftNews = await NewsModel.getNewsCountByStatus('draft');
  const totalViews = await NewsModel.getTotalViews();

  return {
    total: totalNews,
    published: publishedNews,
    draft: draftNews,
    views: totalViews,
  };
};
