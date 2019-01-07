const Post = require('../models/post');
const User = require('../models/user');
const Forum = require('../models/forum');
const Thread = require('../models/thread');


exports.get = async (req, res) => {
  const { id } = req.params;
  let { related } = req.query;

  related = related ? related.split(',') : null;

  const { err, post } = await Post.get(id, related);
  if (err) {
    console.log(err);
    throw new Error('Unable to get post');
  }

  if (!post) {
    res.code(404);
    res.send({ message: 'No such post' });
    return;
  }

  const result = { post };

  if (related !== null) {
    const promises = [];

    if (related.includes('user')) {
      promises.push(
        User
          .get('nickname', post.author)
          .then(({ err: error, users }) => {
            if (error) {
              console.log(error);
              throw new Error('Unable to get author');
            }
            [result.author] = users;
          }),
      );
    }

    if (related.includes('forum')) {
      promises.push(
        Forum
          .get('slug', post.forum)
          .then(({ err: error, forums }) => {
            if (error) {
              console.log(error);
              throw new Error('Unable to get forum');
            }
            [result.forum] = forums;
          }),
      );
    }

    if (related.includes('thread')) {
      promises.push(Thread.get('id', post.thread));

      promises.push(
        Thread
          .get('id', post.thread)
          .then(({ err: error, threads }) => {
            if (error) {
              console.log(error);
              throw new Error('Unable to get thread');
            }
            [result.thread] = threads;
          }),
      );
    }

    await Promise.all(promises);
  }

  res.code(200);
  res.send(result);
};


exports.update = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    const { err, post } = await Post.get(id);
    if (err) {
      console.log(err);
      throw new Error('Unable to get post');
    }

    res.code(200);
    res.send(post);
  }

  const { err, post } = await Post.update(id, message);
  if (err) {
    console.log(err);
    throw new Error('Unable to update post');
  }

  if (!post) {
    res.code(404);
    res.send({ message: 'Unable to find post' });
    return;
  }

  res.code(200);
  res.send(post);
};
