const Thread = require('../controllers/thread');


const threadRoutes = [
  { method: 'post', url: '/forum/:forum/create', func: Thread.create },

  { method: 'post', url: '/thread/:name_or_id/create', func: () => null },
  // Создание новых постов

  { method: 'get', url: '/thread/:name_or_id/details', func: () => null },
  // Получение информации о ветке обсуждения

  { method: 'post', url: '/thread/:name_or_id/details', func: () => null },
  // Обновление ветки

  { method: 'get', url: '/thread/:name_or_id/posts', func: () => null },
  // Сообщения данной ветви обсуждения

  { method: 'post', url: '/thread/:name_or_id/vote', func: () => null },
  // Проголосовать за ветвь обсуждения
];

module.exports = threadRoutes;
