import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const rethinkdbConfig = (() => {

  let config = {
    host: rethinkDBHost(process.env.RETHINKDB_HOST, process.env.DYNO),
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

// bare bones load balancer so we can use multiple proxies for RethinkDB
// For multiple proxies, set RETHINKDB_HOST to "url1 url2 url3"
// Pins each dyno to a proxy based on DYNO number, e.g. 'web.1', 'web.2'
// backwards compatible with single host setup, see specs for examples
export function rethinkDBHost(envHosts, envServer) {
  const hosts = envHosts.split(' ').filter(s => s);

  if (hosts.length === 1) return hosts[0];

  const serverID = envServer ? parseInt(envServer.split('.').pop()) : null

  // serverID can be null or NaN (if the parseInt fails)
  // pick a random host if no server available
  if (!serverID) return hosts[Math.floor(Math.random() * hosts.length)]

  return hosts[serverID % hosts.length]
};

export default rethinkdbConfig
