const User = require('../controllers/user');


const userRoutes = [
  { method: 'post', url: '/user/:nickname/create',  func: User.create },
  { method: 'get',  url: '/user/:nickname/profile', func: User.get },
  { method: 'post', url: '/user/:nickname/profile', func: User.update },
];


module.exports = userRoutes;
