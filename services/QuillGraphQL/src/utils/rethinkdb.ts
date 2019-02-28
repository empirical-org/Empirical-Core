export default require('rethinkdbdash')({
  port: process.env.RETHINKDB_PORT,
  host: process.env.RETHINKDB_HOST,
  user: process.env.RETHINKDB_USER,
  password: process.env.RETHINKDB_PASS,
  ssl: {
    key: process.env.RETHINKDB_TLS_KEY,
    cert: process.env.RETHINKDB_TLS_CERT
  }
});
