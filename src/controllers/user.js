const User = require('../models/user');


exports.create = async (req, res) => {
  const userData = {
    nickname: req.params.nickname,
    fullname: req.body.fullname,
    email: req.body.email,
    about: req.body.about,
  };

  const conflicted = await User.getConflicted(
    userData.nickname,
    userData.email,
  );
  if (conflicted.err) {
    throw new Error('Unable to find conflicts', conflicted.err);
  }

  if (conflicted.users.length !== 0) {
    res.body = conflicted.users;
    res.send(409);
    return;
  }

  const created = await User.create(userData);
  if (created.err) throw new Error('Unable to create user.', created.err);

  res.body = created.user;
  res.send(201);
};


exports.get = async (req, res) => {
  const { nickname } = req.params;
  const { err, users } = await User.get('nickname', nickname);
  if (err) throw new Error('Unable to get user', err);

  // TODO: FIXME: 404 if can't find user

  [res.body] = users;
  res.send(200);
};


exports.update = async (req, res) => {
  const userData = {
    nickname: req.params.nickname,
    fullname: req.body.fullname,
    email: req.body.email,
    about: req.body.about,
  };

  // TODO: FIXME: many other cases

  const { err, result } = await User.update(userData);

  res.body = userData;
  res.send(200);
};
