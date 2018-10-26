
const forumRoutes = [
  { method: 'post', url: '/forum/create', func: () => null },
  // Создание форума
  { method: 'get', url: '/forum/:name/details', func: () => null },
  // Получение информации о форуме
  { method: 'post', url: '/forum/:name/create', func: () => null },
  // Создание ветки
  { method: 'get', url: '/forum/:name/users', func: () => null },
  // Пользователи данного форума
  { method: 'get', url: '/forum/:name/threads', func: () => null },
  // Список ветвей обсужления форума
];

module.exports = forumRoutes;
