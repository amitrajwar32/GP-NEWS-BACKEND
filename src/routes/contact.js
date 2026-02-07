import express from 'express';
import * as contactController from '../controllers/contactController.js';
import { validateContactRequest } from '../middleware/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public: create contact message
router.post('/', validateContactRequest, contactController.createContact);

// Admin: manage contacts (protected) - must be after POST
router.get('/', verifyToken, contactController.getContacts);
router.get('/:id', verifyToken, contactController.getContactById);
router.patch('/:id/read', verifyToken, contactController.markAsRead);
router.delete('/:id', verifyToken, contactController.deleteContact);

export default router;
