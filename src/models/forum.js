const db = require('../utils/database');


class Forum {
  constructor() {
    this.table = 'forums';
    this.rows = ['title', 'slug', 'creator'];
  }


  async create(forumData) {
    const { title, slug, user } = forumData;

    const query = {
      text: `
        INSERT INTO ${this.table} (${this.rows.join(', ')})
        VALUES($1, $2, $3);
      `,
      values: [title, slug, user],
    };

    const { err } = await db.makeQuery(query);

    // TODO: maybe SELECT query?..
    const createdForum = {
      ...forumData,
      posts: 0,
      threads: 0,
    };

    return { err, forum: createdForum };
  }
}


module.exports = new Forum();
