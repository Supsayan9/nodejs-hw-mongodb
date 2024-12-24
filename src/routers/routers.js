import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { createContactSchema, updateContactSchema } from '../utils/schemas.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

// Маршрути для контактів
router.get('/contacts', getContacts);
router.get('/contacts/:contactId', isValidId, getContactById);

router.post('/contacts', validateBody(createContactSchema), createContact);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContact,
);

router.delete('/contacts/:contactId', isValidId, deleteContact);

export default router;
