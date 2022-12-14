import fs from 'fs'
import path from 'path'

export const rethinkdbConfig = (hosts, server, authKey, publicKey, useSSL) => {
  const db = 'quill_lessons';
  const hostWithPort = rethinkDBHost(hosts, server);
  const [host, port] = splitStringOnLast(hostWithPort, ':');
  const ssl = (useSSL === 'true') ? { ca_certs: Buffer.from(publicKey, 'utf8') } : undefined;

  return {
    host,
    port,
    db,
    password: authKey,
    ssl,
  }
}

// bare bones load balancer so we can use multiple proxies for RethinkDB
// For multiple proxies, set RETHINKDB_HOSTS to "url1:port url2:port url3:port"
// Pins each dyno to a proxy based on DYNO number, e.g. 'web.1', 'web.2'
// compatible with single host setup, see specs for examples
export const rethinkDBHost = (envHosts, envServer) => {
  if (envHosts === undefined) return null;

  const hosts = envHosts.split(' ').filter(s => s);

  if (hosts.length === 1) return hosts[0];

  const serverID = envServer ? parseInt(envServer.split('.').pop()) : null

  // serverID can be null or NaN (if the parseInt fails)
  // pick a random host if no server available
  if (!serverID) return hosts[Math.floor(Math.random() * hosts.length)]

  return hosts[serverID % hosts.length]
};

export const splitStringOnLast = (string, char) => {
  const index = string.lastIndexOf(char);

  // if char not found, return an array with full string and null
  if (index === -1) return [string, null];

  return [string.slice(0, index), string.slice(index + 1)];
}

export default rethinkdbConfig
