const Post = require('../models/post');


exports.get = async (req, res) => {
  const { id } = req.params;

  const { err, post } = await Post.get(id);
  if (err) {
    console.log(err);
    throw new Error('Unable to get post');
  }

  // if (!post) {
  //   res.code(404);
  //   res.send({ message: 'No such post' });
  //   return;
  // }

  res.code(200);
  res.send({ post });
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

  res.code(200);
  res.send(post);
};
