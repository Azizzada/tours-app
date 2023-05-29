const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
});

userschema.pre('save', async function (next) {
  // only run this function if password was actualy modified.
  if (!this.isModified('password')) return next();

  // hashed the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // setting the passowrdConfirm to undefined becuase we dont want to show the password in database and inscripting is not really usefull.
  // so we are setting is to empty of undefined. bacause its for validation and we have allready validated it with password
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userschema);

module.exports = User;
