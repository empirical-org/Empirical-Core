require('dotenv').config()
import { GraphQLServer } from 'graphql-yoga';
import { default as typeDefs } from './typeDefs'
import { default as resolvers } from './resolvers'
import decodeLmsSession from './utils/lms_session_decoder'

const opts = {
  port: 7777,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

const context = (req) => ({
  req: req.request,
  user: decodeLmsSession(req.request)
});

const server = new GraphQLServer({ typeDefs, resolvers, context } as any);

server.express.use(require('cookie-parser')());

server.start(opts, () => {
  console.log(
    `😄 Server running at http://localhost:${opts.port}`
  );
});