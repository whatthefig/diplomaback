const reglogRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  createUser, login,
} = require('../controllers/users');

reglogRout.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), createUser);

reglogRout.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = reglogRout;
