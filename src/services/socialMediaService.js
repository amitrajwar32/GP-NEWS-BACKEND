import * as SocialMediaModel from '../models/SocialMedia.js';
import { logger } from '../utils/logger.js';

// Create social media service
export const createSocialMediaService = async (platformName, url, iconName) => {
  try {
    if (!platformName || !url) {
      throw new Error('Platform name and URL are required');
    }

    const nameExists = await SocialMediaModel.platformNameExists(platformName);
    if (nameExists) {
      throw new Error(`Platform '${platformName}' already exists`);
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL format');
    }

    const id = await SocialMediaModel.createSocialMedia(platformName, url, iconName);
    const socialMedia = await SocialMediaModel.getSocialMediaById(id);

    return socialMedia;
  } catch (error) {
    logger.error('Create social media error:', error.message);
    throw error;
  }
};

// Get all active social media service
export const getAllSocialMediaService = async () => {
  try {
    const socialMedia = await SocialMediaModel.getAllSocialMedia();
    return socialMedia;
  } catch (error) {
    logger.error('Get social media error:', error.message);
    throw error;
  }
};

// Get all social media for admin service
export const getAllSocialMediaAdminService = async () => {
  try {
    const socialMedia = await SocialMediaModel.getAllSocialMediaAdmin();
    return socialMedia;
  } catch (error) {
    logger.error('Get all social media admin error:', error.message);
    throw error;
  }
};

// Get social media by ID service
export const getSocialMediaByIdService = async (id) => {
  try {
    if (!id) {
      throw new Error('ID is required');
    }

    const socialMedia = await SocialMediaModel.getSocialMediaById(id);
    if (!socialMedia) {
      throw new Error('Social media not found');
    }

    return socialMedia;
  } catch (error) {
    logger.error('Get social media by ID error:', error.message);
    throw error;
  }
};

// Update social media service
export const updateSocialMediaService = async (id, platformName, url, iconName, displayOrder) => {
  try {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!platformName || !url) {
      throw new Error('Platform name and URL are required');
    }

    const socialMedia = await SocialMediaModel.getSocialMediaById(id);
    if (!socialMedia) {
      throw new Error('Social media not found');
    }

    if (platformName !== socialMedia.platform_name) {
      const nameExists = await SocialMediaModel.platformNameExists(platformName, id);
      if (nameExists) {
        throw new Error(`Platform '${platformName}' already exists`);
      }
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL format');
    }

    await SocialMediaModel.updateSocialMedia(id, platformName, url, iconName, displayOrder);
    const updatedSocialMedia = await SocialMediaModel.getSocialMediaById(id);

    return updatedSocialMedia;
  } catch (error) {
    logger.error('Update social media error:', error.message);
    throw error;
  }
};

// Delete social media service
export const deleteSocialMediaService = async (id) => {
  try {
    if (!id) {
      throw new Error('ID is required');
    }

    const socialMedia = await SocialMediaModel.getSocialMediaById(id);
    if (!socialMedia) {
      throw new Error('Social media not found');
    }

    await SocialMediaModel.deleteSocialMedia(id);

    return { message: 'Social media deleted successfully' };
  } catch (error) {
    logger.error('Delete social media error:', error.message);
    throw error;
  }
};

// Restore social media service
export const restoreSocialMediaService = async (id) => {
  try {
    if (!id) {
      throw new Error('ID is required');
    }

    const socialMedia = await SocialMediaModel.getSocialMediaById(id);
    if (!socialMedia) {
      throw new Error('Social media not found');
    }

    await SocialMediaModel.restoreSocialMedia(id);
    const restoredSocialMedia = await SocialMediaModel.getSocialMediaById(id);

    return restoredSocialMedia;
  } catch (error) {
    logger.error('Restore social media error:', error.message);
    throw error;
  }
};
