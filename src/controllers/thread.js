const Thread = require('../models/thread');


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
