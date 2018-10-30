const Forum = require('../models/forum');


exports.create = async (req, res) =>  {
  const forumData = {
    title: req.body.title,
    user: req.body.user,
    slug: req.body.slug,
  };

  const { err, forum } = await Forum.create(forumData);
  if (err) throw new Error('Unable to create forum', err);

  res.body = forum;
  res.send(201);
};

// exports.details(req, res) {

// }

// exports.newThread(req, res) {

// }

// exports.users(req, res) {

// }

// exports.threads(req, res) {

// }
