import * as SettingsModel from '../models/Settings.js';
import { logger } from '../utils/logger.js';

// Get all settings
export const getAllSettingsService = async () => {
  try {
    const settings = await SettingsModel.getAllSettings();
    // Convert to object for easier access
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.setting_key] = s.setting_value;
    });
    return settingsObj;
  } catch (error) {
    logger.error('Get all settings error:', error.message);
    throw error;
  }
};

// Get setting by key
export const getSettingByKeyService = async (key) => {
  try {
    if (!key) {
      throw new Error('Setting key is required');
    }

    const setting = await SettingsModel.getSettingByKey(key);
    if (!setting) {
      throw new Error(`Setting '${key}' not found`);
    }

    return setting;
  } catch (error) {
    logger.error('Get setting by key error:', error.message);
    throw error;
  }
};

// Update setting
export const updateSettingService = async (key, value) => {
  try {
    if (!key || value === null || value === undefined) {
      throw new Error('Setting key and value are required');
    }

    const result = await SettingsModel.upsertSetting(key, value);
    if (!result) {
      throw new Error('Failed to update setting');
    }

    const updatedSetting = await SettingsModel.getSettingByKey(key);
    return updatedSetting;
  } catch (error) {
    logger.error('Update setting error:', error.message);
    throw error;
  }
};
