const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MyError = require('../modules/error');

module.exports.findUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new MyError('Пользователь с такими данными уже зарегистрирован', 409);
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then(() => {
          res.send({ message: 'Пользователь создан' });
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
          sameSite: false,
        })
        .send({ message: 'Авторизация прошла успешно' })
        .end();
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', {
    maxAge: -1,
    sameSite: false,
  })
    .send({ message: 'Пользователь разлогинен' });
};
