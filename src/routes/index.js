const forumRoutes = require('./forum');
const postRoutes = require('./post');
const serviceRoutes = require('./service');
const threadRoutes = require('./thread');
const userRoutes = require('./user');

const routes = [
  ...forumRoutes,
  ...postRoutes,
  ...serviceRoutes,
  ...threadRoutes,
  ...userRoutes,
];

module.exports = routes;
