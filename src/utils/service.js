const db = require('./database');


exports.status = async () => {
  const query = {
    text: `
      SELECT
        (SELECT COUNT(*) FROM forums ) AS forum,
        (SELECT COUNT(*) FROM "users") AS user,
        (SELECT COUNT(*) FROM threads) AS thread,
        (SELECT COUNT(*) FROM   posts) AS post
    `,
  };

  const { err, result } = await db.makeQuery(query);
  if (err) return { err };
  return { status: result.rows[0] };
};


exports.clear = async () => {
  db.userSet.clear();
  const query = {
    text: `
      TRUNCATE TABLE
        user_posts, votes, posts,
        threads, forums, "users";

      INSERT INTO "users"
      VALUES (0, 0, 0, 0);

      INSERT INTO forums
      VALUES (0, 0, 0, 0, 0);

      INSERT INTO threads (id, title, author, forum, message)
      VALUES (0, 0, 0, 0, 0);

      INSERT INTO posts (id, parent, root, path, author, message, forum, thread)
      VALUES (0, 0, 0, '{}', 0, 0, 0, 0);
    `,
  };

  const { err } = await db.makeQuery(query);

  if (err) return { err };
  return { status: 'ok' };
};
