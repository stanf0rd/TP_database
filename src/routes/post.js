const Post = require('../controllers/post');

const postRoutes = [
  { method: 'get', url: '/post/:id/details', func: () => null },
  // Получение информации о ветке обсуждения
  { method: 'post', url: '/post/:id/details', func: () => null },
  // Изменение сообщения
];

module.exports = postRoutes;
