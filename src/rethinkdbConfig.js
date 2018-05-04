import fs from 'fs'
import path from 'path'

const rethinkdbConfig = (() => {
  const pathToCert = path.resolve(__dirname + '/..') + '/public-key.crt'

  let config = {
    host: process.env.RETHINKDB_HOST || 'localhost',
    port: process.env.RETHINKDB_PORT || 28015,
    db: 'quill_lessons'
  }

  if (process.env.RETHINKDB_AUTH_KEY) {
    config['authKey'] = process.env.RETHINKDB_AUTH_KEY
  }

  if (process.env.RETHINKDB_USE_SSL === 'true') {
    fs.readFile(pathToCert, (err, caCert) => {
      if (err) {
        console.log(err)
      } else {
        config['ssl'] = { ca: caCert }
      }
    })
  }

  return config
})()

export default rethinkdbConfig
