import * as ContactModel from '../models/Contact.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Create contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const contactId = await ContactModel.saveContact(name, email, phone || null, message);

    sendSuccess(res, { id: contactId }, 'Message sent successfully', 201);
  } catch (error) {
    logger.error('Create contact error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get paginated contacts (admin)
export const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await ContactModel.getAllContacts(page, limit);

    sendSuccess(res, result, 'Contacts retrieved successfully');
  } catch (error) {
    logger.error('Get contacts error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Get single contact by ID (admin)
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactModel.getContactById(id);
    if (!contact) return sendError(res, 'Contact not found', 404);
    sendSuccess(res, contact, 'Contact retrieved successfully');
  } catch (error) {
    logger.error('Get contact by id error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Mark contact as read (admin)
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await ContactModel.markAsRead(id);
    if (!ok) return sendError(res, 'Contact not found', 404);
    sendSuccess(res, null, 'Contact marked as read');
  } catch (error) {
    logger.error('Mark contact read error:', error.message);
    sendError(res, error.message, 500);
  }
};

// Delete contact (admin)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await ContactModel.deleteContact(id);
    if (!ok) return sendError(res, 'Contact not found', 404);
    sendSuccess(res, null, 'Contact deleted successfully');
  } catch (error) {
    logger.error('Delete contact error:', error.message);
    sendError(res, error.message, 500);
  }
};
