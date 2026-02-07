import express from 'express';
import * as newsController from '../controllers/newsController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateCreateNewsRequest } from '../middleware/validation.js';

const router = express.Router();

// Public routes - MUST BE BEFORE :slug route
router.get('/breaking', newsController.getBreakingNews);
router.get('/latest', newsController.getLatestNews);
router.get('/category/:slug', newsController.getNewsByCategory);

// Admin routes - MUST BE BEFORE :slug route
router.post('/', verifyToken, validateCreateNewsRequest, newsController.createNews);
router.get('/', verifyToken, newsController.getAllNews);
router.put('/:id', verifyToken, validateCreateNewsRequest, newsController.updateNews);
router.patch('/:id/status', verifyToken, newsController.updateNewsStatus);
router.delete('/:id', verifyToken, newsController.deleteNews);

// Admin dashboard stats
router.get('/admin/stats', verifyToken, newsController.getDashboardStats);

// Dynamic slug route - MUST BE LAST
router.get('/:slug', newsController.getNewsBySlug);

export default router;
