import * as categoryService from '../services/categoryService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Create category controller
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await categoryService.createCategoryService(name, description);

    sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    logger.error('Create category error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Get all categories controller
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoriesService();

    sendSuccess(res, categories, 'Categories retrieved successfully', 200);
  } catch (error) {
    logger.error('Get categories error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get single category controller
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryService.getCategoryByIdService(id);

    sendSuccess(res, category, 'Category retrieved successfully', 200);
  } catch (error) {
    logger.error('Get category error:', error.message);
    sendError(res, error.message, 404);
  }
};

// Update category controller
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await categoryService.updateCategoryService(id, name, description);

    sendSuccess(res, category, 'Category updated successfully', 200);
  } catch (error) {
    logger.error('Update category error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Delete category controller
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryService.deleteCategoryService(id);

    sendSuccess(res, {}, 'Category deleted successfully', 200);
  } catch (error) {
    logger.error('Delete category error:', error.message);
    sendError(res, error.message, 400);
  }
};
