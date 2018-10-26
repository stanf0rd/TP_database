

const serviceRoutes = [
  { method: 'post', url: '/service/clear', func: () => null },
  // Очистка всех данных в базе
  { method: 'get', url: '/service/status', func: () => null },
  // Получение инфомарции о базе данных
];

module.exports = serviceRoutes;
