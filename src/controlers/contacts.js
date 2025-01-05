import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById as serviceGetContactById,
  createContact as serviceCreateContact,
  updateContact as serviceUpdateContact,
  deleteContact as serviceDeleteContact,
} from '../services/contacts.js';

const validateName = (name) => {
  if (!name || name.length < 3) {
    throw new createHttpError(400, 'Name must be at least 3 characters long');
  }
};

const validateContactId = (contactId) => {
  if (!contactId) {
    throw new createHttpError(400, 'Contact ID is required');
  }
  if (!/^[0-9a-fA-F]{24}$/.test(contactId)) {
    throw new createHttpError(400, 'Invalid Contact ID format');
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Contacts fetched successfully',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    validateContactId(contactId);

    const contact = await serviceGetContactById(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact fetched successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name } = req.body;

  try {
    validateName(name);

    const newContact = await serviceCreateContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name } = req.body;

  try {
    validateContactId(contactId);
    if (name) {
      validateName(name);
    }

    const updatedContact = await serviceUpdateContact(contactId, req.body);
    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    validateContactId(contactId);

    const deleted = await serviceDeleteContact(contactId);
    if (!deleted) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
