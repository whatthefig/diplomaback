require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const articlesRout = require('./routes/articles');
const userRout = require('./routes/users');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

console.log(process.env.NODE_ENV);

const app = express();
app.use(cookieParser());

app.get('/posts', (req) => console.log(req.cookies.jwt));


const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/', userRout);
app.use('/', articlesRout);
app.use((req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.code || 500).json({ message: err.message } || { message: 'На сервере произошла ошибка' });
  next();
});

app.listen(PORT, () => console.log(`Используется порт ${PORT}`));
