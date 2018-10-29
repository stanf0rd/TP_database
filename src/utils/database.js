const { Pool } = require('pg');


class Database {
  constructor() {
    this.pool = new Pool();
  }

  async makeQuery(query) {
    const client = await this.pool.connect();

    const response = {};
    try {
      await client.query('BEGIN');

      response.result = await client.query(query);

      await client.query('COMMIT');
    } catch (err) {
      response.err = err;

      await client.query('ROLLBACK');
    } finally {
      client.release();
    }

    return response;
  }
}


module.exports = new Database();
