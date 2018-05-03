import * as fs from 'fs'

const rethinkdbConfig = (() => {
  const cert = fs.readFileSync(path.resolve(__dirname, '../cert'))
  let config = {
    host: process.env.RETHINKDB_HOST || 'localhost',
    port: process.env.RETHINKDB_PORT || 28015,
    db:   'quill_lessons'
  }

  if (process.env.RETHINKDB_AUTH_KEY) {
    config['authKey'] = process.env.RETHINKDB_AUTH_KEY
  }

  if (process.env.RETHINKDB_USER) {
    config['user'] = process.env.RETHINKDB_USER
  }

  if (process.env.RETHINKDB_PASSWORD) {
    config['password'] = process.env.RETHINKDB_PASSWORD
  }

  if (cert) {
    config['ssl'] = { ca: cert }
  }

  return config
})()

export default rethinkdbConfig
