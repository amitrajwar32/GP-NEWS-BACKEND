import express from 'express';
import authRoutes from './auth.js';
import newsRoutes from './news.js';
import categoryRoutes from './categories.js';
import uploadRoutes from './upload.js';
import contactRoutes from './contact.js';
import socialMediaRoutes from './socialMedia.js';
import settingsRoutes from './settings.js';

const router = express.Router();

// Health check - first route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/social-media', socialMediaRoutes);
router.use('/settings', settingsRoutes);

export default router;
