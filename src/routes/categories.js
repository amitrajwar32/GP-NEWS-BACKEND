import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateCreateCategoryRequest } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Protected routes (admin only)
router.post('/', verifyToken, validateCreateCategoryRequest, categoryController.createCategory);
router.put('/:id', verifyToken, validateCreateCategoryRequest, categoryController.updateCategory);
router.delete('/:id', verifyToken, categoryController.deleteCategory);

export default router;
