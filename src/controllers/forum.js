const Forum = require('../models/forum');
const Thread = require('../models/thread');

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
      res.code(404);
      res.send({ message: 'User not found' });
      return;
    }

    if (err.code === '23505') {
      // conflict
      const conflicts = await Forum.get('slug', forumData.slug);
      if (conflicts.err) throw new Error('Unable to get forum', conflicts.err);
      res.code(409);
      res.send(conflicts.forums[0]);
      return;
    }

    console.log(err);
  }

  res.code(201);
  res.send(forum);
};


exports.details = async (req, res) => {
  const { slug } = req.params;
  const { err, forums } = await Forum.get('slug', slug);

  if (err) throw new Error('Unable to get forum details');

  if (!forums.length) {
    res.code(404);
    res.send({ message: 'No such forum' });
    return;
  }

  res.code(200);
  res.send(forums[0]);
};


exports.threads = async (req, res) => {
  const { slug } = req.params;
  const { limit, desc, since } = req.query;

  const { err, threads } = await Thread.get(
    'forum', slug, { limit, desc, since },
  );

  if (err) throw new Error('Unable to get forum threads');

  if (!threads.length) {
    const { forums } = await Forum.get('slug', slug);
    if (!forums.length) {
      res.code(404);
      res.send({ message: 'No such forum' });
      return;
    }
  }

  res.code(200);
  res.send(threads);
};


exports.users = async (req, res) => {
  const { slug } = req.params;

  const { err, users } = await Forum.getUsers(slug, req.query);
  if (err) {
    console.log(err);
    throw new Error('Unable to get users');
  }

  if (!users.length) {
    const { forums } = await Forum.get('slug', slug);
    if (!forums.length) {
      res.code(404);
      res.send({ message: 'No such users' });
      return;
    }
  }

  res.code(200);
  res.send(users);
};
