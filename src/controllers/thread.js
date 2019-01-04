const Thread = require('../models/thread');
const Post = require('../models/post');


exports.create = async (req, res) => {
  const threadData = {
    title: req.body.title,
    author: req.body.author,
    message: req.body.message,
    forum: req.params.forum,
  };

  const { created, slug } = req.body;
  if (created) threadData.created = created;
  if (slug) threadData.slug = slug;

  const { err, thread } = await Thread.create(threadData);

  if (err) {
    if (err.code === '23502') {
      // row not found
      res.code(404);
      res.send({ message: 'Forum not found' });
      return;
    }

    if (err.code === '23503') {
      // key is not present
      res.code(404);
      res.send({ message: 'User not found' });
      return;
    }

    if (err.code === '23505') {
      // conflict
      const conflicts = await Thread.get('slug', slug);
      if (conflicts.err) throw new Error('Unable to get forum', conflicts.err);
      res.code(409);
      res.send(conflicts.threads[0]);
      return;
    }

    console.log(err);
    throw new Error('Unable to create thread', err);
  }

  res.code(201);
  res.send(thread);
};


exports.createPosts = async (req, res) => {
  console.log(req.body);
  const newPosts = req.body;
  const { slugOrId } = req.params;

  if (newPosts.length === 0) {
    res.code(201);
    res.send([]);
    return;
  }

  const { err, posts } = await Post.create(slugOrId, newPosts);
  if (err) throw new Error('Unable to create posts');

  res.code(201);
  res.send(posts);
};
