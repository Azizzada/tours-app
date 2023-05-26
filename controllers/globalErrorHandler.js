// this is a error middleware that runs last
module.exports = (err, req, res, next) => {
  // statusCode => status(404 or 500 or any number)
  // status => status'sucess' 'fail' 'error'

  err.statusCode = err.statusCode || 500; // means if the status code is not defined it will give status 500
  err.status = err.status || 'error'; // means if there is no status then the status is error

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
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
  }
};
