const Forum = require('../controllers/forum');


const forumRoutes = [
  { method: 'post', url: '/forum/create',         func: Forum.create },
  { method: 'get',  url: '/forum/:slug/details',  func: Forum.details },
  { method: 'get',  url: '/forum/:slug/users',    func: Forum.users },
  { method: 'get',  url: '/forum/:slug/threads',  func: Forum.threads },
];


module.exports = forumRoutes;
