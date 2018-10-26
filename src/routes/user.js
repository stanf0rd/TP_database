

const userRoutes = [
  { method: 'post', url: '/user/:name/create', func: () => null },
  // Создание нового пользователя
  { method: 'get', url: '/user/:name/profile', func: () => null },
  // Получение информации о пользователе
  { method: 'post', url: '/user/:name/profile', func: () => null },
  // Изменение данных о пользователе
];


module.exports = userRoutes;
