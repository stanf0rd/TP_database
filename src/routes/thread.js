
const threadRoutes = [
  { method: 'post', url: '/thread/:name/create', func: () => null },
  { method: 'post', url: '/thread/:id/create', func: () => null },
  // Создание новых постов
  { method: 'get', url: '/thread/:name/details', func: () => null },
  { method: 'get', url: '/thread/:id/details', func: () => null },
  // Получение информации о ветке обсуждения
  { method: 'post', url: '/thread/:name/details', func: () => null },
  { method: 'post', url: '/thread/:id/details', func: () => null },
  // Обновление ветки
  { method: 'get', url: '/thread/:name/posts', func: () => null },
  { method: 'get', url: '/thread/:id/posts', func: () => null },
  // Сообщения данной ветви обсуждения
  { method: 'post', url: '/thread/:name/vote', func: () => null },
  { method: 'post', url: '/thread/:id/vote', func: () => null },
  // Проголосовать за ветвь обсуждения
];

module.exports = threadRoutes;
