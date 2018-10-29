const { Pool } = require('pg');


class Database {
  constructor() {
    this.pool = new Pool();
  }

  async makeQuery(query) {
    const client = await this.pool.connect();

    const result = {};
    try {
      await client.query('BEGIN');

      // TODO: what does it returns?
      result.result = await client.query(query);

      await client.query('COMMIT');
    } catch (err) {
      result.err = err;
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }

    return result;
  }
}


module.exports = new Database();
