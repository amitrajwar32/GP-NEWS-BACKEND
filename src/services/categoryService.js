import * as CategoryModel from '../models/Category.js';
import { slugify } from '../utils/helpers.js';

// Create category service
export const createCategoryService = async (name, description = '') => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Category name is required');
  }

  const trimmedName = name.trim();

  // Check if category name already exists
  const nameExists = await CategoryModel.categoryNameExists(trimmedName);
  if (nameExists) {
    throw new Error('Category with this name already exists');
  }

  const slug = slugify(trimmedName);

  // Check if slug already exists
  const slugExists = await CategoryModel.categorySlugExists(slug);
  if (slugExists) {
    throw new Error('Category with this slug already exists');
  }

  const categoryId = await CategoryModel.createCategory(trimmedName, slug, description);
  return {
    id: categoryId,
    name: trimmedName,
    slug,
    description,
  };
};

// Get all categories
export const getAllCategoriesService = async () => {
  const categories = await CategoryModel.getAllCategories();
  return categories;
};

// Get category by ID
export const getCategoryByIdService = async (id) => {
  const category = await CategoryModel.getCategoryById(parseInt(id, 10));
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

// Update category service
export const updateCategoryService = async (id, name, description = '') => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Category name is required');
  }

  const category = await CategoryModel.getCategoryById(parseInt(id, 10));
  if (!category) {
    throw new Error('Category not found');
  }

  const trimmedName = name.trim();

  // Check if new name already exists (excluding current category)
  const nameExists = await CategoryModel.categoryNameExists(trimmedName, parseInt(id, 10));
  if (nameExists) {
    throw new Error('Category with this name already exists');
  }

  const slug = slugify(trimmedName);

  // Check if slug already exists (excluding current category)
  const slugExists = await CategoryModel.categorySlugExists(slug, parseInt(id, 10));
  if (slugExists) {
    throw new Error('Category with this slug already exists');
  }

  const updated = await CategoryModel.updateCategory(parseInt(id, 10), trimmedName, slug, description);
  if (!updated) {
    throw new Error('Failed to update category');
  }

  return {
    id: parseInt(id, 10),
    name: trimmedName,
    slug,
    description,
  };
};

// Delete category service
export const deleteCategoryService = async (id) => {
  const category = await CategoryModel.getCategoryById(parseInt(id, 10));
  if (!category) {
    throw new Error('Category not found');
  }

  const deleted = await CategoryModel.deleteCategory(parseInt(id, 10));
  if (!deleted) {
    throw new Error('Failed to delete category');
  }

  return true;
};
