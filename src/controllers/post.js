const Post = require('../models/post');


exports.get = async (req, res) => {
  const { id } = req.params;
  let { related } = req.query;

  related = related ? related.split(',') : null;

  const { err, data } = await Post.get(id, related);
  if (err) {
    console.log(err);
    throw new Error('Unable to get post');
  }

  if (!data) {
    res.code(404);
    res.send({ message: 'No such post' });
    return;
  }

  const post = {
    id: data.id,
    parent: data.parent,
    root: data.root,
    author: data.author,
    message: data.message,
    path: data.path,
    isEdited: data.isEdited,
    forum: data.forum,
    thread: data.thread,
    created: data.created,
  };

  let author = null;
  if (related && related.includes('user')) {
    author = {
      nickname: data.nickname,
      email: data.email,
      fullname: data.fullname,
      about: data.about,
    };
  }

  let thread = null;
  if (related && related.includes('thread')) {
    thread = {
      id: data.threadid,
      title: data.threadtitle,
      author: data.threadauthor,
      forum: data.threadforum,
      message: data.threadmessage,
      votes: data.votes,
      slug: data.threadslug,
      created: data.threadcreated,
    };
  }

  let forum = null;
  if (related && related.includes('forum')) {
    forum = {
      title: data.title,
      slug: data.slug,
      user: data.user,
      posts: data.posts,
      threads: data.threads,
    };
  }

  const result = { post };
  if (thread) result.thread = thread;
  if (author) result.author = author;
  if (forum) result.forum = forum;

  res.code(200);
  res.send(result);
};


exports.update = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    console.log('no message');
    const { err, data } = await Post.get(id);
    if (err) {
      console.log(err);
      throw new Error('Unable to get post');
    }

    res.code(200);
    res.send(data);
    return;
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
