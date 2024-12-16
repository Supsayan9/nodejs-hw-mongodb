// server.js
import express from 'express';
import {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from './controlers/contacts.js';

const app = express();

app.use(express.json());

app.get('/contacts', getContacts);
app.get('/contacts/:contactId', getContactById);
app.post('/contacts', createContact);
app.put('/contacts/:contactId', updateContact);
app.delete('/contacts/:contactId', deleteContact);

export const setupServer = () => {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
  });
};
