const Service = require('../controllers/service');

const serviceRoutes = [
  { method: 'post', url: '/service/clear', func: () => null },
  // Очистка всех данных в базе
  { method: 'get', url: '/service/status', func: Service.status },
  // Получение инфомарции о базе данных
];

module.exports = serviceRoutes;
