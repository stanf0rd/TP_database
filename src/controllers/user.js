const User = require('../models/user');


exports.create = async (req, res) => {
  const userData = {
    nickname: req.params.nickname,
    fullname: req.body.fullname,
    email: req.body.email,
    about: req.body.about,
  };

  const conflicted = await User.getConflicted(
    userData.nickname, userData.email,
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

  if (!users.length) {
    res.body = { message: 'No such user' };
    res.send(404);
    return;
  }

  [res.body] = users;
  res.send(200);
};


exports.update = async (req, res) => {
  const { fullname, email, about } = req.body;
  const { nickname } = req.params;

  // searching for old data
  const found = await User.get('nickname', nickname);
  if (found.err) throw new Error('Unable to get user', found.err);
  const [user] = found.users;
  if (!user) {
    res.body = { message: 'No such user' };
    res.send(404);
    return;
  }

  // constructing new data
  const newData = {};
  if (fullname) newData.fullname = fullname;
  if (about) newData.about = about;
  if (email) {
    const { err, users: conflicted } = await User.get('email', email);
    if (err) throw new Error('Unable to get user', err);
    if (!conflicted.length) newData.email = email;
    else {
      res.body = { message: 'Conflict occured' };
      res.send(409);
      return;
    }
  }

  // check if data is empty
  if (Object.keys(newData).length === 0) {
    res.body = user;
    res.send(200);
    return;
  }

  // updating
  const { err } = await User.update(nickname, newData);
  if (err) throw new Error('Unable to update user', err);

  const updatedUser = { ...user, ...newData };
  res.body = updatedUser;
  res.send(200);
};
