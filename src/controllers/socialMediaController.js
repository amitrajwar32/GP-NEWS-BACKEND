import * as socialMediaService from '../services/socialMediaService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Create social media
export const createSocialMedia = async (req, res) => {
  try {
    const { platformName, url, iconName } = req.body;

    const socialMedia = await socialMediaService.createSocialMediaService(platformName, url, iconName);

    sendSuccess(res, socialMedia, 'Social media link created successfully', 201);
  } catch (error) {
    logger.error('Create social media error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Get all active social media
export const getSocialMedia = async (req, res) => {
  try {
    const socialMedia = await socialMediaService.getAllSocialMediaService();

    sendSuccess(res, socialMedia, 'Social media links retrieved successfully', 200);
  } catch (error) {
    logger.error('Get social media error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get all social media for admin (including inactive)
export const getSocialMediaAdmin = async (req, res) => {
  try {
    const socialMedia = await socialMediaService.getAllSocialMediaAdminService();

    sendSuccess(res, socialMedia, 'Social media links retrieved successfully', 200);
  } catch (error) {
    logger.error('Get social media admin error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get single social media
export const getSocialMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await socialMediaService.getSocialMediaByIdService(id);

    sendSuccess(res, socialMedia, 'Social media link retrieved successfully', 200);
  } catch (error) {
    logger.error('Get social media by ID error:', error.message);
    sendError(res, error.message, 404);
  }
};

// Update social media
export const updateSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { platformName, url, iconName, displayOrder } = req.body;

    const socialMedia = await socialMediaService.updateSocialMediaService(id, platformName, url, iconName, displayOrder);

    sendSuccess(res, socialMedia, 'Social media link updated successfully', 200);
  } catch (error) {
    logger.error('Update social media error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Delete social media
export const deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;

    await socialMediaService.deleteSocialMediaService(id);

    sendSuccess(res, {}, 'Social media link deleted successfully', 200);
  } catch (error) {
    logger.error('Delete social media error:', error.message);
    sendError(res, error.message, 400);
  }
};

// Restore social media
export const restoreSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await socialMediaService.restoreSocialMediaService(id);

    sendSuccess(res, socialMedia, 'Social media link restored successfully', 200);
  } catch (error) {
    logger.error('Restore social media error:', error.message);
    sendError(res, error.message, 400);
  }
};
