const db = require('../utils/database');


class Vote {
  constructor() {
    this.table = 'votes';
  }

  async getVote(slugOrId, user) {
    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE "user" = '${user}'
        AND forum = (
          SELECT slug
          FROM threads
          WHERE slug = '${slugOrId}'
          ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
        )
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { vote: result.rows[0] };
  }

  async addVote(slugOrId, user, voice) {
    const query = {
      text: `
        INSERT INTO ${this.table}
        VALUES (
          '${user}', (
            SELECT slug
            FROM threads
            WHERE slug = '${slugOrId}'
            ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
          ), '${voice}'
        )
        ON CONFLICT ("user", forum)
        DO UPDATE SET vote = ${voice}
        RETURNING *
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { vote: result.rows[0] };
  }
}


module.exports = new Vote();
