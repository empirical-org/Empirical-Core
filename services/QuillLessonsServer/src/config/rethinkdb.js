import fs from 'fs'
import path from 'path'

import dotenv from 'dotenv'

dotenv.config()

const rethinkdbConfig = (() => {

  let config = {
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    db:   'quill_lessons'
  }

  if (process.env.RETHINKDB_AUTH_KEY) {
    config['authKey'] = process.env.RETHINKDB_AUTH_KEY
  }

  if (process.env.RETHINKDB_USE_SSL === 'true') {
    const caCert  = Buffer.from(process.env.RETHINKDB_PUBLIC_KEY, 'utf8');
    config['ssl'] = { ca: caCert }
  }

  return config
})()

export default rethinkdbConfig
