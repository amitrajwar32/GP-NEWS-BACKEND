import * as uploadService from '../services/uploadService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Upload image controller
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file provided', 400);
    }

    const filename = `${Date.now()}_${req.file.originalname}`;

    const result = await uploadService.uploadImageService(req.file.buffer, filename);

    sendSuccess(res, result, 'Image uploaded successfully', 201);
  } catch (error) {
    logger.error('Upload image error:', error.message);
    sendError(res, error.message, 500);
  }
};
