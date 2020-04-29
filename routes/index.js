const indexRout = require('express').Router();
const auth = require('../middlewares/auth');
const articleRout = require('./articles');
const userRout = require('./users');
const reglogRout = require('./reglog');


indexRout.use(reglogRout);
indexRout.use(auth);
indexRout.use(userRout);
indexRout.use(articleRout);

module.exports = indexRout;
