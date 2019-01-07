const Service = require('../utils/service');


exports.status = async (req, res) => {
  const { err, status } = await Service.status();
  if (err) {
    console.log(err);
    throw new Error('Cannot get status', err);
  }

  const result = {
    forum: parseInt(status.forum, 10),
    user: parseInt(status.user, 10),
    thread: parseInt(status.thread, 10),
    post: parseInt(status.post, 10),
  };

  res.code(200);
  res.send({
    forum: result.forum === 1 ? 0 : result.forum,
    user: result.user === 1 ? 0 : result.user,
    thread: result.thread === 1 ? 0 : result.thread,
    post: result.post === 1 ? 0 : result.post,
  });
};


exports.clear = async (req, res) => {
  const { err } = await Service.clear();
  if (err) console.log(err);

  res.code(200);
  res.send();
};
