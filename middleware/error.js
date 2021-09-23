const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  //log to console for dev
  console.log(err.stack.red);

  //Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resource with the ID of ${err.value} not found: this means the id you entered is incorrect or doesn't exist.`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered - you tried to submit a value that already exists in another resource.`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message =
      'You are missing required values from your resource:' +
      Object.values(err.errors).map(
        (value) => ' ' + value.message.toLowerCase()
      );
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
