const mongoose = require('mongoose');
const dotenv = require('dotenv');

// ANY BUG THATS NOT CAUGHT ELSEWHERE IS CALLED UNCAUGHT EXEPTION
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config/dev.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successfull');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WE CAN CATCH ERROR FROM DATABASE HERE OR ANY OTHER ERROR AT LAST - ALSO CALLED SAFETY NET
// each time there is an UNHANDLED REJECTION/PROMISSES we can use PROCESS.on to capture it
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // before shuting down anything we first neet to shutdown the server then shitdown all the processes
  server.close(() => {
    process.exit(1);
  });
});

// in order to avoid 24 hrs shutdown protocol of HEROKU we need to add below code
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully ');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
