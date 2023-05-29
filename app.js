const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});
// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// this is for Error handling. this should always be at the last after all the routes so that if the url is not found
// anywhere else it will eventually trigger this and this will show an the below error.
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // here we are calling the error class we created. and when we pass an error inside next() it will
  // automaticly go to our globalErrorHandler.
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// its out error.js which handles errors for us
app.use(globalErrorHandler);

// 4) START THE SERVER

module.exports = app;
