import express from 'express';
import * as socialMediaController from '../controllers/socialMediaController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', socialMediaController.getSocialMedia);

// Protected routes (Admin only)
router.post('/', verifyToken, socialMediaController.createSocialMedia);
router.get('/admin/all', verifyToken, socialMediaController.getSocialMediaAdmin);
router.get('/:id', verifyToken, socialMediaController.getSocialMediaById);
router.put('/:id', verifyToken, socialMediaController.updateSocialMedia);
router.delete('/:id', verifyToken, socialMediaController.deleteSocialMedia);
router.patch('/:id/restore', verifyToken, socialMediaController.restoreSocialMedia);

export default router;
