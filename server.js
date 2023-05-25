const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/dev.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successfull');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
