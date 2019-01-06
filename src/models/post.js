const db = require('../utils/database');


class Post {
  constructor() {
    this.table = 'posts';
    this.columns = [
      'id',
      'parent',
      'path',
      'author',
      'message',
      'thread',
      'forum',
    ];
  }

  async create(slugOrId, posts) {
    let values = '';
    posts.forEach((post) => {
      values += `(
        (SELECT nextval('posts_id_seq')::integer),
        ${post.parent || 'DEFAULT'},
        (SELECT path FROM posts WHERE id = ${post.parent || '0'}) ||
        (SELECT currval('posts_id_seq')::integer),
        '${post.author}',
        '${post.message}',
        (SELECT id FROM thread),
        (SELECT forum FROM thread)
      ), `;
    });
    values = values.slice(0, -2);

    const query = {
      text: `
        WITH thread AS (
          SELECT id, forum
          FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
          LIMIT 1
        )
        INSERT INTO ${this.table} (${this.columns.join(', ')})
        VALUES ${values} RETURNING *
      `,
    };

    // console.log(query.text);

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { posts: result.rows };
  }

  async get(slugOrId, options) {
    const parsedOptions = options || {};
    const limit = 'limit' in parsedOptions ? parsedOptions.limit : 100;
    const desc = 'desc' in parsedOptions ? parsedOptions.desc : null;
    const since = 'since' in parsedOptions ? parsedOptions.since : null;
    const sort = 'sort' in parsedOptions ? parsedOptions.sort : null;

    const query = {};

    if (!sort || sort === 'flat') {
      query.text = `
        SELECT * FROM ${this.table}
        WHERE thread = (
          SELECT id FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
        )
        ORDER BY
          created ${desc === 'true' ? 'DESC' : 'ASC'},
          id ${desc === 'true' ? 'DESC' : 'ASC'}
        LIMIT ${limit}
      `;
    } else if (sort === 'tree') {
      query.text = `
        SELECT *
        FROM posts
        WHERE thread = (
          SELECT id FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
        )
        ORDER BY path ${desc === 'true' ? 'DESC' : 'ASC'}
        LIMIT ${limit}
      `;
    } else if (sort === 'parent_tree') {
      query.text = `
        WITH parents AS (
          SELECT * FROM ${this.table}
          WHERE thread = (
            SELECT id FROM threads
            WHERE slug = '${slugOrId}'
            ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
          )
          AND parent = 0
          LIMIT ${limit}
        )
        SELECT * FROM ${this.table}
        WHERE path && (SELECT array(SELECT id FROM parents))
        ORDER BY
          path[1] ${desc === 'true' ? 'DESC' : 'ASC'},
          path ASC
      `;
    } else {
      throw new Error('Unknown sort type');
    }

    // console.log(query.text);

    const { err, result } = await db.makeQuery(query);
    if (err) return (err);
    return { posts: result.rows };
  }
}


module.exports = new Post();
