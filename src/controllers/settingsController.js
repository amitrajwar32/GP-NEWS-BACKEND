import * as settingsService from '../services/settingsService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Get all settings (public)
export const getAllSettings = async (req, res) => {
  try {
    const settings = await settingsService.getAllSettingsService();
    sendSuccess(res, settings, 'Settings retrieved successfully', 200);
  } catch (error) {
    logger.error('Get all settings error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get specific setting by key (public)
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await settingsService.getSettingByKeyService(key);
    sendSuccess(res, setting.setting_value, 'Setting retrieved successfully', 200);
  } catch (error) {
    logger.error('Get setting error:', error.message);
    sendError(res, error.message, 404);
  }
};

// Update setting (admin only)
export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await settingsService.updateSettingService(key, value);
    sendSuccess(res, setting, 'Setting updated successfully', 200);
  } catch (error) {
    logger.error('Update setting error:', error.message);
    sendError(res, error.message, 400);
  }
};
