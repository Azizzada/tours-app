class AppError extends Error {
  constructor(message, statusCode) {
    // by calling the parent class we already set the message call to incoming message
    super(message);

    this.statusCode = statusCode;
    // first converting interger to staring then checking if it starts with 4, like 404 then its fail else its error like 500
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // all the error we create ourself will be operational errors so thus the name isOperational
    this.isOperational = true;

    // stack is the location where the error happend
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
