const User = require('../controllers/user');


const userRoutes = [
  { method: 'post', url: '/user/:nickname/create', func: User.create },
  // Создание нового пользователя

  { method: 'get', url: '/user/:nickname/profile', func: User.get },
  // Получение информации о пользователе

  { method: 'post', url: '/user/:nickname/profile', func: User.update },
  // Изменение данных о пользователе
];


module.exports = userRoutes;
