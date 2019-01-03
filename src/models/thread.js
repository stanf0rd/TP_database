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
      values.push(`$$${threadData[key]}$$`);
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
    const { limit, desc, since } = options;

    const query = {
      text: `
        SELECT * FROM ${this.table}
        WHERE ${key}='${value}'
        ${ since
            ? desc === 'true'
              ? `AND created <= '${ since }'`
              : `AND created >= '${ since }'`
            : ''
        }
        ORDER BY created ${ desc === 'true' ? 'DESC' : 'ASC' }
        ${ limit ? `LIMIT ${limit}` : '' }
        `,
      };

    const { err, result } = await db.makeQuery(query);
    if (err) {
      console.error(err);
      return { err };
    }

    return { threads: result.rows };
  }
}


module.exports = new Thread();
