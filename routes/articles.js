const articleRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  createArticle, getArticles, deleteArticle, getMyArticles,
} = require('../controllers/articles');

articleRout.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    date: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().uri().required(),
    image: Joi.string().uri().required(),
  }),
}), createArticle);

articleRout.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId(),
  }),
}), deleteArticle);

articleRout.get('/articles', getArticles);

articleRout.get('/myarticles', getMyArticles);


module.exports = articleRout;
