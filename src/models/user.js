const db = require('../utils/database');


class User {
  constructor() {
    this.table = 'forum_users';
    this.rows = ['nickname', 'fullname', 'email', 'about'];
  }


  async create(user) {
    const {
      nickname,
      fullname,
      email,
      about,
    } = user;

    const query = {
      name: 'create_user',
      text: `INSERT INTO ${this.table} (${this.rows.join(', ')})
      VALUES($1, $2, $3, $4);`,
      values: [nickname, fullname, email, about],
    };

    const { err } = await db.makeQuery(query);

    return { err, user };
  }


  async getConflicted(nickname, email) {
    const query = {
      // TODO: think: SELECT TOP 1 FROM ... ?
      text: `SELECT * FROM ${this.table}
             WHERE nickname='${nickname}'
             OR email='${email}';`,
    };

    const { err, result } = await db.makeQuery(query);

    return { err, users: result.rows };
  }


  async get(key, value) {
    const query = {
      // TODO: think: SELECT TOP 1 FROM ... ?
      text: `SELECT * FROM ${this.table}
             WHERE ${key}='${value}'
             LIMIT 1;`,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };

    return { users: result.rows };
  }


  async update(user) {
    const {
      nickname,
      fullname,
      email,
      about,
    } = user;
    const query = {
      text: `UPDATE ${this.table}
             SET fullname='${fullname}',
                 email='${email}',
                 about='${about}'
             WHERE nickname='${nickname}';`,
    };

    const { err, result } = await db.makeQuery(query);

    console.log(err, result);

    return { err, result };
  }
}


module.exports = new User();
