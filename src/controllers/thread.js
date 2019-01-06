const Thread = require('../models/thread');
const Vote = require('../models/vote');
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
  const newPosts = req.body;
  const { slugOrId } = req.params;

  if (newPosts.length === 0) {
    res.code(201);
    res.send([]);
    return;
  }

  const { err, posts } = await Post.create(slugOrId, newPosts);
  if (err) {
    console.log(err);
    throw new Error('Unable to create posts');
  }

  res.code(201);
  res.send(posts);
};


exports.vote = async (req, res) => {
  const { nickname } = req.body;
  let { voice } = req.body;
  const { slugOrId } = req.params;

  const { err, vote } = await Vote.getVote(slugOrId, nickname);

  if (err) {
    console.log(err);
    throw new Error('Cannot get vote', err);
  }

  const upd = await Vote.addVote(slugOrId, nickname, voice);
  if (upd.error) {
    console.log(upd.error);
    throw new Error('Cannot add new or update vote');
  }

  if (vote) voice -= vote.vote;

  const thread = await Thread.vote(slugOrId, voice);
  if (thread.err) {
    console.log(thread.err);
    throw new Error('Cannot vote thread', thread.err);
  }

  res.code(200);
  res.send(thread.updated);
};


exports.details = async (req, res) => {
  const { slugOrId } = req.params;

  const { err, thread } = await Thread.details(slugOrId);

  if (err) {
    console.log(err);
    throw new Error('Unable to get thread details');
  }

  res.code(200);
  res.send(thread);
};


exports.posts = async (req, res) => {
  const { slugOrId } = req.params;

  const { err, posts } = await Post.get(slugOrId, req.query);

  // console.log(err, posts);

  res.code(200);
  res.send(posts);
};
