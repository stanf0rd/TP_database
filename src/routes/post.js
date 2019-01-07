const Post = require('../controllers/post');

const postRoutes = [
  { method: 'get', url: '/post/:id/details', func: Post.get },
  // Получение информации о ветке обсуждения
  { method: 'post', url: '/post/:id/details', func: Post.update },
  // Изменение сообщения
];

module.exports = postRoutes;
