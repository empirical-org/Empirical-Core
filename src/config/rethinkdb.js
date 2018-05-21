import dotenv from 'dotenv'
dotenv.config()

const rethinkdbConfig = (() => {
  let config = {
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    db: 'quill_lessons'
  }

  if (process.env.RETHINKDB_AUTH_KEY) {
    config['authKey'] = process.env.RETHINKDB_AUTH_KEY
  }

  if (process.env.RETHINKDB_SSL_CERT) {
    config['ssl'] = { ca: Buffer(process.env.RETHINKDB_SSL_CERT) }
  }

  return config
})()

export default rethinkdbConfig
