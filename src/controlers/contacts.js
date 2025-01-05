import {
  getAllContacts,
  getContactById as serviceGetContactById,
  createContact as serviceCreateContact,
  updateContact as serviceUpdateContact,
  deleteContact as serviceDeleteContact,
} from '../services/contacts.js';

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

export const getContactById = async (req, res) => {
  try {
    const contact = await serviceGetContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Contact fetched successfully',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name } = req.body;

    // Проверка на длину имени
    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: 'Name must be at least 3 characters long' });
    }

    const newContact = await serviceCreateContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { name } = req.body;
    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: 'Name must be at least 3 characters long' });
    }

    const updatedContact = await serviceUpdateContact(
      req.params.contactId,
      req.body,
    );
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const deleted = await serviceDeleteContact(req.params.contactId);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
