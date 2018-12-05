require('dotenv').config()
import { GraphQLServer } from 'graphql-yoga';
import { default as typeDefs } from './typeDefs'
import { default as resolvers } from './resolvers'

const opts = {
  port: 7777,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

const server = new GraphQLServer({ typeDefs, resolvers } as any);

server.start(opts, () => {
  console.log(
    `😄 Server running at http://localhost:${opts.port}`
  );
});