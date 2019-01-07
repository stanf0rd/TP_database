const db = require('../utils/database');


class User {
  constructor() {
    this.table = '"users"';
  }


  async create(user) {
    const {
      nickname,
      email,
      fullname,
      about,
    } = user;

    const query = {
      name: 'create_user',
      text: `
        INSERT INTO ${this.table}
        VALUES($1, $2, $3, $4);
      `,
      values: [nickname, email, fullname, about],
    };

    const { err } = await db.makeQuery(query);

    return { err, user };
  }


  async getConflicted(nickname, email) {
    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE nickname='${nickname}'
        OR email='${email}'
      `,
    };

    const { err, result } = await db.makeQuery(query);

    return { err, users: result.rows };
  }


  async get(key, value, options) {
    const parsedOptions = options || {};
    const limit = 'limit' in parsedOptions ? parsedOptions.limit : null;
    // const desc = 'desc' in parsedOptions ? parsedOptions.desc : null;
    // const since = 'since' in parsedOptions ? parsedOptions.since : null;

    // let sinceExpr = '';
    // if (since) {
    //   sinceExpr = desc === 'true'
    //     ? `AND nickname < '${since}'`
    //     : `AND nickname > '${since}'`;
    // }

    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE ${key}='${value}'
        ${limit ? `LIMIT ${limit}` : ''}
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };

    return { users: result.rows };
  }


  async update(nickname, user) {
    const params = [];
    Object.keys(user).forEach((key) => {
      params.push(`${key}=$$${user[key]}$$`);
    });

    const query = {
      text: `
        UPDATE ${this.table}
        SET ${params.join(', ')}
        WHERE nickname='${nickname}';
      `,
    };

    const { err, result } = await db.makeQuery(query);

    return { err, result };
  }
}


module.exports = new User();
