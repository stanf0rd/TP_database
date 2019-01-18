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
        AND thread = (
          SELECT id
          FROM threads
          WHERE ${Number.isInteger(Number(slugOrId)) ? 'id' : 'slug'} = '${slugOrId}'
          LIMIT 1
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
            SELECT id
            FROM threads
            WHERE ${Number.isInteger(Number(slugOrId)) ? 'id' : 'slug'} = '${slugOrId}'
            LIMIT 1
          ), '${voice}'
        )
        ON CONFLICT ("user", thread)
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
