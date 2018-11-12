const db = require('../utils/database');


class Forum {
  constructor() {
    this.table = 'forums';
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
          (SELECT nickname FROM "users" WHERE nickname=$3)
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

    // console.log('in f_model', err, result);

    return { forums: result.rows };
  }
}


module.exports = new Forum();
