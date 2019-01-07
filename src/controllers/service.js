const Service = require('../utils/service');


exports.status = async (req, res) => {
  const { err, status } = await Service.status();
  if (err) {
    console.log(err);
    throw new Error('Cannot get status', err);
  }

  res.code(200);
  res.send({
    forum: parseInt(status.forum, 10),
    user: parseInt(status.user, 10),
    thread: parseInt(status.thread, 10),
    post: parseInt(status.post, 10),
  });
};


exports.clear = async (req, res) => {
  console.log(req);
  const { err } = await Service.clear();
  if (err) console.log(err);

  res.code(200);
  res.send();
};
