export default require('rethinkdbdash')({
  port: process.env.RETHINKDB_PORT,
  host: process.env.RETHINKDB_HOST,
  ssl: true
});
