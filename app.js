require('dotenv').config();

const { PORT = 3001, MONGO_URL, NODE_ENV } = process.env;
const cors = require('cors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const indexRout = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const MyError = require('./modules/error');

console.log(process.env.NODE_ENV);

const app = express();
app.use(cookieParser());
app.use('/api', require('./routes'));

const MONGO_ADRESS = NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/mydb';

app.use(express.static(path.join(__dirname, 'diplomafront')));

app.use(cors({
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(MONGO_ADRESS);
mongoose.connect(MONGO_ADRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(indexRout);
app.use(errorLogger);
app.use(errors());

app.use(() => {
  throw new MyError('Запрашиваемый ресурс не найден', 404);
});

app.use((err, req, res, next) => {
  res.status(err.code || 500).json({ message: err.message } || { message: 'На сервере произошла ошибка' });
  next();
});

app.listen(PORT, () => console.log(`Используется порт ${PORT}`));
