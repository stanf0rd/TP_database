const db = require('../utils/database');


class Thread {
  constructor() {
    this.table = 'threads';
  }


  async create(threadData) {
    const columns = [];
    const values = [];
    Object.keys(threadData).forEach((key) => {
      columns.push(key);
      if (key === 'forum') {
        values.push(`(SELECT slug FROM forums WHERE slug = '${threadData[key]}')`);
      } else {
        values.push(`$$${threadData[key]}$$`);
      }
    });

    const query = {
      text: `
        INSERT INTO ${this.table} (${columns.join(', ')})
        VALUES (${values.join(', ')})
        RETURNING *
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };

    return { thread: result.rows[0] };
  }


  async get(key, value, options) {
    const parsedOptions = options || {};
    const limit = 'limit' in parsedOptions ? parsedOptions.limit : null;
    const desc = 'desc' in parsedOptions ? parsedOptions.desc : null;
    const since = 'since' in parsedOptions ? parsedOptions.since : null;

    let sinceExpr;
    if (since) {
      sinceExpr = desc === 'true'
        ? `AND created <= '${since}'`
        : `AND created >= '${since}'`;
    }

    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE ${key}='${value}'
        ${sinceExpr || ''}
        ORDER BY created ${desc === 'true' ? 'DESC' : 'ASC'}
        ${limit ? `LIMIT ${limit}` : ''}
        `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };

    return { threads: result.rows };
  }


  async vote(slugOrId, voice) {
    const query = {
      text: `
        UPDATE ${this.table}
        SET votes = votes+${voice}
        WHERE slug = '${slugOrId}'
        ${Number.isInteger(Number(slugOrId)) ? `OR id = '${slugOrId}'` : ''}
        RETURNING *
      `,
    };

    const { err, result } = await db.makeQuery(query);
    if (err) return { err };
    return { updated: result.rows[0] };
  }
}


module.exports = new Thread();
