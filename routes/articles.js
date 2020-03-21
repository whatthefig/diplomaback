const articlesRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  createArticle, getArticles, deleteArticle,
} = require('../controllers/articles');

articlesRout.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().uri().required(),
    image: Joi.string().uri().required(),
  }),
}), createArticle);

articlesRout.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId(),
  }),
}), deleteArticle);

articlesRout.get('/articles', getArticles);

module.exports = articlesRout;
