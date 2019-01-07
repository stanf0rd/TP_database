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

  async get(id) {
    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE id = '${id}'
        LIMIT 1
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { post: result.rows[0] };
  }

  async update(id, message) {
    const query = {
      text: `
        UPDATE ${this.table}
        SET
          message = '${message}',
          "isEdited" = true
        WHERE id = '${id}'
        RETURNING *
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { post: result.rows[0] };
  }

  async create(id, posts) {
    let values = '';
    posts.forEach((post) => {
      const parent = post.parent ? `
        (SELECT id FROM ${this.table}
        WHERE id = ${post.parent}
        AND thread = (SELECT id FROM thread))`
        : 'DEFAULT';

      values += `(
        (SELECT nextval('posts_id_seq')::integer),
        ${parent},
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
          WHERE id = '${id}'
          LIMIT 1
        )
        INSERT INTO ${this.table} (${this.columns.join(', ')})
        VALUES ${values} RETURNING *
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { posts: result.rows };
  }

  async getFromThread(slugOrId, options) {
    const parsedOptions = options || {};
    const limit = 'limit' in parsedOptions ? parsedOptions.limit : 100;
    const desc = 'desc' in parsedOptions ? parsedOptions.desc : null;
    const since = 'since' in parsedOptions ? parsedOptions.since : null;
    const sort = 'sort' in parsedOptions ? parsedOptions.sort : null;

    const query = {};

    if (!sort || sort === 'flat') {
      let sinceExpr = '';
      if (since) {
        sinceExpr = desc === 'true'
          ? `AND id < '${since}'`
          : `AND id > '${since}'`;
      }

      query.text = `
        SELECT * FROM ${this.table}
        WHERE thread = (
          SELECT id FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
          LIMIT 1
        )
        ${sinceExpr}
        ORDER BY
          created ${desc === 'true' ? 'DESC' : 'ASC'},
          id ${desc === 'true' ? 'DESC' : 'ASC'}
        LIMIT ${limit}
      `;
    } else if (sort === 'tree') {
      let treeSinceExpr = '';
      if (since) {
        treeSinceExpr = `
        AND path ${desc === 'true' ? '<' : '>'} (
          SELECT path FROM ${this.table}
          WHERE id = '${since}'
        )
        `;
      }
      query.text = `
        SELECT *
        FROM posts
        WHERE thread = (
          SELECT id FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
          LIMIT 1
        )
        ${treeSinceExpr}
        ORDER BY path ${desc === 'true' ? 'DESC' : 'ASC'}
        LIMIT ${limit}
      `;
    } else if (sort === 'parent_tree') {
      let parentTreeSinceExpr = '';
      if (since) {
        if (desc === 'true') {
          parentTreeSinceExpr = `
          AND path < (
            SELECT path[1:1] FROM ${this.table}
            WHERE id = '${since}'
          )`;
        } else {
          parentTreeSinceExpr = `
          AND path > (
            SELECT path FROM ${this.table}
            WHERE id = '${since}'
          )`;
        }
      }
      query.text = `
        WITH parents AS (
          SELECT id FROM ${this.table}
          WHERE thread = (
            SELECT id FROM threads
            WHERE slug = '${slugOrId}'
            ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
            LIMIT 1
          )
          AND parent = 0
          ${parentTreeSinceExpr}
          ORDER BY id ${desc === 'true' ? 'DESC' : 'ASC'}
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

    const { err, result } = await db.makeQuery(query);
    if (err) return (err);
    return { posts: result.rows };
  }
}


module.exports = new Post();
