const db = require('../utils/database');


class Post {
  constructor() {
    this.table = 'posts';
    this.columns = [
      'parent',
      'author',
      'message',
      'thread',
      'forum',
    ];
  }

  async create(slugOrId, posts) {
    let values = '';
    posts.forEach((post) => {
      values += post.parent ? post.parent : 'DEFAULT';
      values += `, '${post.author}'`;
      values += `, '${post.message}',
        (SELECT id FROM thread),
        (SELECT forum FROM thread)`;
    });

    const query = {
      text: `
        WITH thread AS (
          SELECT id, forum
          FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
        )
        INSERT INTO ${this.table} (${this.columns.join(', ')})
        VALUES (${values}) RETURNING *
      `,
    };

    console.log(query.text);

    const { err, result } = await db.makeQuery(query);
    if (err) {
      console.log(err);
      return { err };
    }

    return { posts: result.rows };
  }
}


module.exports = new Post();
