const Article = require('../models/article');
const MyError = require('../modules/error');

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then(() => res.send({ message: 'Статья добавлена' }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        throw new MyError('Статья не найдена', 404);
      }
      if (article.owner.toString() !== req.user._id.toString()) {
        throw new MyError('Недостаточно прав', 403);
      } else {
        Article.findByIdAndDelete(articleId)
          .then(() => res.send({ message: 'Статья удалена' }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ articles }))
    .catch(next);
};

module.exports.getMyArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ articles }))
    .catch(next);
};

module.exports.findArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        throw new MyError('Статья не найдена', 404);
      }
      res.json(article);
    })
    .catch(next);
};
