const jwt = require('jsonwebtoken');
const MyError = require('../modules/error');

console.log(process.env.NODE_ENV);

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev');
  } catch (err) {
    return next(new MyError('Необходима авторизация', 401));
  }
  req.user = payload;

  return next();
};
