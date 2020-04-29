const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const MyError = require('../modules/error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    validate: {
      validator(str) {
        return validator.isEmail(str);
      },
      message: 'Эта строка должна быть EMAIL',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new MyError('Неправильные почта или пароль', 401);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new MyError('Неправильные почта или пароль', 401);
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
