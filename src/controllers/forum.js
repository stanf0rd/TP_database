const Forum = require('../models/forum');


exports.create = async (req, res) =>  {
  const forumData = {
    title: req.body.title,
    slug: req.body.slug,
    user: req.body.user,
  };

  const { err, forum } = await Forum.create(forumData);

  if (err) {
    if (err.code === '23502') {
      // referenced row not found
      res.body = { message: 'User not found' };
      res.send(404);
      return;
    }

    if (err.code === '23505') {
      // conflict
      const conflicts = await Forum.get('slug', forumData.slug);
      if (conflicts.err) throw new Error('Unable to get forum', conflicts.err);
      [res.body] = conflicts.forums;
      res.send(409);
      return;
    }

    console.log(err);
  }

  res.body = forum;
  res.send(201);
};


exports.details = async (req, res) => {
  const { slug } = req.params;
  const { err, forums } = await Forum.get('slug', slug);

  if (err) throw new Error('Unable to get forum details');

  if (!forums.length) {
    res.body = { message: 'No such forum' };
    res.send(404);
    return;
  }

  [res.body] = forums;
  res.send(200);
};

// exports.newThread(req, res) {

// }

// exports.users(req, res) {

// }

// exports.threads(req, res) {

// }
