import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', settingsController.getAllSettings);
router.get('/:key', settingsController.getSettingByKey);

// Protected routes (Admin only)
router.put('/:key', verifyToken, settingsController.updateSetting);

export default router;
