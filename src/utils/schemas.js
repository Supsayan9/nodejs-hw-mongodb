const Joi = require('joi');

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  isFavourite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string(),
  isFavourite: Joi.boolean(),
}).min(1);

module.exports = { createContactSchema, updateContactSchema };
