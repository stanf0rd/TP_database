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
    this.userSet = db.userSet;
  }

  async get(id, related) {
    const search = related ? `posts.*
      ${related.includes('user') ? ', "users".*' : ''}
      ${related.includes('forum') ? ', forums.*' : ''}
      ${related.includes('thread') ? `
        , threads.id AS threadid
        , threads.title AS threadtitle
        , threads.author AS threadauthor
        , threads.forum AS threadforum
        , threads.message AS threadmessage
        , threads.votes
        , threads.slug AS threadslug
        , threads.created AS threadcreated
      ` : ''}
    ` : 'posts.*';

    const vars = related ? `
      ${related.includes('user') ? `
        LEFT JOIN "users" ON "users".nickname = ${this.table}.author
      ` : ''}
      ${related.includes('thread') ? `
        LEFT JOIN threads ON threads.id = ${this.table}.thread
      ` : ''}
      ${related.includes('forum') ? `
        LEFT JOIN forums ON forums.slug = ${this.table}.forum
      ` : ''}
    ` : '';

    const query = {
      text: `
        SELECT ${search} FROM ${this.table}
        ${vars || ''}
        WHERE ${this.table}.id = ${id} LIMIT 1
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { data: result.rows[0] };
  }

  async update(id, message) {
    const query = {
      text: `
        UPDATE ${this.table}
        SET
          message = '${message}'
        WHERE id = '${id}'
        RETURNING *
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { post: result.rows[0] };
  }

  async create(id, posts, forum) {
    let values = '';
    let fuserValues = '';
    let dollars = 1;
    const data = [id];
    posts.forEach((post) => {
      const parent = post.parent ? `
        (SELECT id FROM ${this.table}
        WHERE id = $${++dollars}
        AND thread = (SELECT id FROM thread)
        LIMIT 1)`
        : `$${++dollars}::integer`;

      values += `(
        (SELECT nextval('posts_id_seq')::integer),
        ${parent},
        (SELECT path FROM posts WHERE id = $${dollars} LIMIT 1) ||
        (SELECT currval('posts_id_seq')::integer),
        $${++dollars},
        $${++dollars},
        (SELECT id FROM thread),
        (SELECT forum FROM thread)
      ), `;

      if (!this.userSet.has(forum + post.author)) {
        fuserValues += `(
          $${dollars - 1},
          (SELECT forum FROM thread)
        ), `;
        this.userSet.add(forum + post.author);
      }

      data.push(post.parent || 0, post.author, post.message);
    });
    values = values.slice(0, -2);
    fuserValues = fuserValues.slice(0, -2);

    const query = {
      text: `
        WITH thread AS (
          SELECT id, forum
          FROM threads
          WHERE id = $1
          LIMIT 1
        ), inc_posts AS (
          UPDATE forums
          SET posts = posts + ${posts.length}
          WHERE slug = (SELECT forum FROM thread)
        )${(fuserValues) ? `, ins_forum_users AS (
          INSERT INTO user_posts ("user", forum)
          VALUES ${fuserValues}
        )` : ''}
        INSERT INTO ${this.table} (${this.columns.join(', ')})
        VALUES ${values} RETURNING *
      `,
      values: data,
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
          WHERE ${Number.isInteger(Number(slugOrId)) ? 'id' : 'slug'} = '${slugOrId}'
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
          WHERE ${Number.isInteger(Number(slugOrId)) ? 'id' : 'slug'} = '${slugOrId}'
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
            WHERE ${Number.isInteger(Number(slugOrId)) ? 'id' : 'slug'} = '${slugOrId}'
            LIMIT 1
          )
          AND parent = 0
          ${parentTreeSinceExpr}
          ORDER BY id ${desc === 'true' ? 'DESC' : 'ASC'}
          LIMIT ${limit}
        )
        SELECT * FROM ${this.table}
        WHERE root IN (SELECT id FROM parents)
        ORDER BY
          root ${desc === 'true' ? 'DESC' : 'ASC'},
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
