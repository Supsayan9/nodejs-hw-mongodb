const { isValidObjectId } = require('mongoose');
const { BadRequest } = require('http-errors');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(new BadRequest('Invalid ID format'));
  }
  next();
};

module.exports = isValidId;
