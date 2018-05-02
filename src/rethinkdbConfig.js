let rethinkdbConfig = {
  host: process.env.RETHINKDB_HOST || 'localhost',
  port: process.env.RETHINKDB_PORT || 28015,
  db:   'quill_lessons'
}

if (process.env.RETHINKDB_USER) {
  rethinkdbConfig['user'] = process.env.RETHINKDB_USER
}

if (process.env.RETHINKDB_PASSWORD) {
  rethinkdbConfig['password'] = process.env.RETHINKDB_PASSWORD
}

export default rethinkdbConfig
