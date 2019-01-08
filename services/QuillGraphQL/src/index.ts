require('dotenv').config()
import { GraphQLServer } from 'graphql-yoga';
import PubSub from './utils/pubsub';
import { default as typeDefs } from './typeDefs'
import { default as resolvers } from './resolvers'
import decodeLmsSession from './utils/lms_session_decoder'

const opts = {
  port: 7777,
  endpoint: '/graphql',
  subscriptions: { 
    path: '/subscriptions',
    onConnect: (a, socket, c) => {
      console.log("\n\na:", socket)
      console.log("\n\nb:", socket.upgradeReq.headers.cookie)
      return {
        hi: "there"
      }
    },
  },
  playground: '/playground',
}

const context = (req, b, c, d) => {
  console.log("\n\nSetting context", req)
  return ({
  req: req.request,
  user: decodeLmsSession(req.request),
  pubSub: PubSub
})
};

const server = new GraphQLServer({ typeDefs, resolvers, context } as any);

server.express.use(require('cookie-parser')());

server.start(opts, () => {
  console.log(
    `😄 Server running at http://localhost:${opts.port}`
  );
});