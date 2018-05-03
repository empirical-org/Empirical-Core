import fs from 'fs'
import path from 'path'


const rethinkdbConfig = (() => {
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

  if (process.env.RETHINKDB_SSL_CERT === 'true') {
    const cert = fs.readFileSync(path.resolve(__dirname, '../cert'))
    config['ssl'] = { ca: cert }
  }

  return config
})()

export default rethinkdbConfig
