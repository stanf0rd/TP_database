const Thread = require('../controllers/thread');


const threadRoutes = [
  { method: 'post', url: '/forum/:forum/create', func: Thread.create },

  { method: 'post', url: '/thread/:slugOrId/create', func: Thread.createPosts },
  // Создание новых постов

  { method: 'get', url: '/thread/:slugOrId/details', func: () => null },
  // Получение информации о ветке обсуждения

  { method: 'post', url: '/thread/:slugOrId/details', func: () => null },
  // Обновление ветки

  { method: 'get', url: '/thread/:slugOrId/posts', func: () => null },
  // Сообщения данной ветви обсуждения

  { method: 'post', url: '/thread/:slugOrId/vote', func: () => null },
  // Проголосовать за ветвь обсуждения
];

module.exports = threadRoutes;
