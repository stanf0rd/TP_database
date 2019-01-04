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

  if (err) throw new Error('Unable to create thread');

  res.code(201);
  res.send(thread);
};


exports.createPosts = async (req, res) => {
  console.log(req.body);
  // console.log(req.params);
  const newPosts = req.body;
  const { slugOrId } = req.params;

  // console.log(newPosts, slugOrId);

  if (newPosts.length === 0) {
    res.code(201);
    res.send([]);
    return;
  }

  const { err, posts } = await Post.create(slugOrId, newPosts);

  console.log({ posts });

  if (err) throw new Error('Unable to create posts');

  res.code(201);
  res.send(posts);
};
