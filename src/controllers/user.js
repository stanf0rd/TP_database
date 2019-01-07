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
    res.code(409);
    res.send(conflicted.users);
    return;
  }

  const created = await User.create(userData);
  if (created.err) throw new Error('Unable to create user.', created.err);

  res.code(201);
  res.send(created.user);
};


exports.get = async (req, res) => {
  const { nickname } = req.params;
  const { err, users } = await User.get('nickname', nickname, { limit: 1 });
  if (err) {
    console.log(err);
    throw new Error('Unable to get user');
  }

  if (!users.length) {
    res.code(404);
    res.send({ message: 'No such user' });
    return;
  }

  res.code(200);
  res.send(users[0]);
};


exports.update = async (req, res) => {
  const { fullname, email, about } = req.body;
  const { nickname } = req.params;

  // searching for old data
  const found = await User.get('nickname', nickname);
  if (found.err) throw new Error('Unable to get user', found.err);
  const [user] = found.users;
  if (!user) {
    res.code(404);
    res.send({ message: 'No such user' });
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
      res.code(409);
      res.send({ message: 'Conflict occured' });
      return;
    }
  }

  // check if data is empty
  if (Object.keys(newData).length === 0) {
    res.code(200);
    res.send(user);
    return;
  }

  // updating
  const { err } = await User.update(nickname, newData);
  if (err) throw new Error('Unable to update user', err);

  const updatedUser = { ...user, ...newData };
  res.code(200);
  res.send(updatedUser);
};
