const userRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUsers, findUser,
} = require('../controllers/users');

userRout.get('/users', getUsers);

userRout.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId(),
  }),
}), findUser);

module.exports = userRout;
