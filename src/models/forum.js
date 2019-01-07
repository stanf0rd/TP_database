const db = require('../utils/database');


class Forum {
  constructor() {
    this.table = 'forums';
    this.userTable = 'user_posts';
    this.rows = ['title', 'slug', '"user"'];
  }


  async create(forumData) {
    const { title, slug, user } = forumData;

    const query = {
      text: `
        INSERT INTO ${this.table} (${this.rows.join(', ')})
        VALUES(
          $1,
          $2,
          (SELECT nickname FROM "users" WHERE nickname=$3 LIMIT 1)
        )
        RETURNING *;
      `,
      values: [title, slug, user],
    };

    const { err, result } = await db.makeQuery(query);

    if (err) return { err };

    return { forum: result.rows[0] };
  }


  async get(key, value) {
    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE ${key}='${value}';
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };

    return { forums: result.rows };
  }


  async getUsers(slug, options) {
    const parsedOptions = options || {};
    const limit = 'limit' in parsedOptions ? parsedOptions.limit : null;
    const desc = 'desc' in parsedOptions ? parsedOptions.desc : null;
    const since = 'since' in parsedOptions ? parsedOptions.since : null;

    let sinceExpr = '';
    if (since) {
      sinceExpr = desc === 'true'
        ? `AND nickname < '${since}' COLLATE "C"`
        : `AND nickname > '${since}' COLLATE "C"`;
    }

    const query = {
      text: `
        SELECT * FROM "users"
        WHERE nickname IN (
          SELECT "user" FROM ${this.userTable}
          WHERE forum = '${slug}'
        )
        ${sinceExpr}
        ORDER BY nickname COLLATE "C" ${desc === 'true' ? 'DESC' : 'ASC'}
        ${limit ? `LIMIT ${limit}` : ''}
      `,
    };

    console.log(query.text);

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { users: result.rows };
  }
}


module.exports = new Forum();
