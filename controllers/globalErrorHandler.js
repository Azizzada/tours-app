const AppError = require('../utils/appError');

const handleCastErrorFromMongoDB = (error) => {
  // using the content of error and creating our own custum error
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldMongoDB = (error) => {
  // making this error message userfriendly "E11000 duplicate key error collection: tours-app.tours index: name_1 dup key: { name: \"The Snow Adventurer\" }""
  const message = `Duplicate field value: ${error.keyValue.name}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorMongoDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (error) => {
  return new AppError('Invalid authentication. Please log in again!', 401);
};

const handleJWTExpiredError = (error) => {
  return new AppError('Your session has expired! Please log in again!', 401);
};

sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

sendErrorProductionOperationalTrue = (err, res) => {
  // Operational, trusted error: send mesage to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknows error: we dont leak error details to client
  } else {
    // 1) Log error
    console.log('ERROR 💥', err);
    // 1) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

sendErrorProductionOperationalFalse = (err, res) => {
  // Operational, trusted error: send mesage to client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  // programming or other unknows error: we dont leak error details to clien
};

// this is a error middleware that runs last
module.exports = (err, req, res, next) => {
  // statusCode => status(404 or 500 or any number)
  // status => status'sucess' 'fail' 'error'

  err.statusCode = err.statusCode || 500; // means if the status code is not defined it will give status 500
  err.status = err.status || 'error'; // means if there is no status then the status is error

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // in order to handle mongoose errors which are not user friedly we will need to change the structure of those error so
    // that is why we are creating a variable from the err and we are going to make changes to it. they come from validator from mongoose and mongo
    // i first tried to copy using destructuring then this method. it didnt work so i tried this method
    let error = JSON.parse(JSON.stringify(err));
    if (error.name === 'CastError') {
      error = handleCastErrorFromMongoDB(error);
      return sendErrorProductionOperationalFalse(error, res);
    }
    if (error.code === 11000) {
      // making this error message userfriendly "E11000 duplicate key error collection: tours-app.tours index: name_1 dup key: { name: \"The Snow Adventurer\" }""
      error = handleDuplicateFieldMongoDB(error);
      return sendErrorProductionOperationalFalse(error, res);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorMongoDB(error);
      return sendErrorProductionOperationalFalse(error, res);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
      return sendErrorProductionOperationalFalse(error, res);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
      return sendErrorProductionOperationalFalse(error, res);
    }

    sendErrorProductionOperationalTrue(err, res); //this will handle isOperational and other errors EXECPT MONGOOSE ERROR which is handled above
  }
};
