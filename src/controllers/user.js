const User = require('../models/user');


exports.create = async (req, res) => {
  const userData = {
    nickname: req.params.nickname,
    fullname: req.body.fullname,
    email: req.body.email,
    about: req.body.about,
  };

  const conflicted = await User.getConflicted({
    nickname: userData.nickname,
    email: userData.email,
  });
  if (conflicted.err) throw new Error('Unexpected error.', conflicted.err);

  console.log(conflicted);

  if (conflicted.users.length !== 0) {
    res.body = conflicted.users;
    res.send(409);
    return;
  }

  const created = await User.create(userData);
  if (created.err) throw new Error('Unexpected error.', created.err);

  res.body = created.user;
  res.send(201);
};

// exports.get = (req, res) => {
//   console.log(req.params.nickname);
// };

// exports.update = (req, res) => {
//   console.log(req.params.nickname);
// };
