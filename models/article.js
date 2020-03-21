const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator(str) {
        return validator.isURL(str);
      },
      message: 'Эта строка должна быть URL',
    },
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(str) {
        return validator.isURL(str);
      },
      message: 'Эта строка должна быть URL',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.String,
    ref: 'user',
    required: true,
    select: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('article', articleSchema);
