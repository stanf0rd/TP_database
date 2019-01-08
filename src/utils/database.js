const { Pool } = require('pg');


class Database {
  constructor() {
    this.pool = new Pool({
      user: 'forum_app',
      host: 'localhost',
      database: 'postgres',
      password: 'password',
      port: 5432,
    });

    // fs.readFile(
    //   './src/utils/schema.sql',
    //   'utf8',
    //   async (err, content) => {
    //     if (!err) {
    //       const query = { text: content };
    //       const { error } = await this.makeQuery(query);
    //       if (error) throw new Error('Cannot create tables', error);
    //       else console.log('Database ready');
    //     }
    //   },
    // );
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
