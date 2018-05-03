import fs from 'fs'
import path from 'path'


const rethinkdbConfig = (() => {
  let config = {
    host: process.env.RETHINKDB_HOST || 'localhost',
    port: process.env.RETHINKDB_PORT || 28015,
    db:   'quill_lessons'
  }

  if (process.env.RETHINKDB_USER) {
    config['user'] = process.env.RETHINKDB_USER
  }

  if (process.env.RETHINKDB_PASSWORD) {
    config['password'] = process.env.RETHINKDB_PASSWORD
  }

  return config
})()

export default rethinkdbConfig
