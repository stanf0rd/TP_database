const Thread = require('../controllers/thread');


const threadRoutes = [
  { method: 'post', url: '/forum/:forum/create', func: Thread.create },

  { method: 'post', url: '/thread/:slugOrId/create', func: Thread.createPosts },
  // Создание новых постов

  { method: 'get', url: '/thread/:slugOrId/details', func: Thread.details },
  // Получение информации о ветке обсуждения

  { method: 'post', url: '/thread/:slugOrId/details', func: Thread.update },
  // Обновление ветки

  { method: 'get', url: '/thread/:slugOrId/posts', func: Thread.posts },
  // Сообщения данной ветви обсуждения

  { method: 'post', url: '/thread/:slugOrId/vote', func: Thread.vote },
  // Проголосовать за ветвь обсуждения
];

module.exports = threadRoutes;
