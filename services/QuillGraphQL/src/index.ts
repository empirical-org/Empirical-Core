require('dotenv').config()
import { GraphQLServer } from 'graphql-yoga';
import PubSub from './utils/pubsub';
import { default as typeDefs } from './typeDefs'
import { default as resolvers } from './resolvers'
import decodeLmsSession, {decodeLMSWebsocketSession} from './utils/lms_session_decoder'

const opts = {
  port: process.env.PORT || 7777,
  endpoint: '/graphql',
  subscriptions: { 
    path: '/subscriptions',
    onConnect: (a, socket, c) => {
      return {
        req: socket.upgradeReq,
        user: decodeLMSWebsocketSession(socket.upgradeReq.headers.cookie),
        socket
      }
    },
    onDisconnect: (socket, ctx) => {
      if (socket.onDisconnect) return socket.onDisconnect();
    } 
  },
  playground: '/playground',
}

const context = (req, b, c, d) => {
  let additionalContext = {};
  if (req.connection) {
    additionalContext = req.connection.context
  }
  return Object.assign( 
    {
      req: req.request,
      user: decodeLmsSession(req.request),
      pubSub: PubSub
    }, additionalContext
  )
};

const server = new GraphQLServer({ typeDefs, resolvers, context } as any);

server.express.use(require('cookie-parser')());

server.start(opts, () => {
  console.log(
    `😄 Server running at http://localhost:${opts.port}`
  );
});
