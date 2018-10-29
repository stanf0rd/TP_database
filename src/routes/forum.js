const Forum = require('../controllers/forum');


const forumRoutes = [
  { method: 'post', url: '/forum/create',         func: Forum.create },
  { method: 'get',  url: '/forum/:name/details',  func: Forum.details },
  { method: 'post', url: '/forum/:thread/create', func: Forum.newThread },
  { method: 'get',  url: '/forum/:name/users',    func: Forum.users },
  { method: 'get',  url: '/forum/:name/threads',  func: Forum.threads },
];


module.exports = forumRoutes;
