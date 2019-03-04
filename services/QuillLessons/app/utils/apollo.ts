import ApolloClient from "apollo-client";
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

// Create an http link:
const httpLink = new HttpLink({
  uri: `https://${process.env.GRAPHQL_URL}/graphql`
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://${process.env.GRAPHQL_URL}/subscriptions`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink,
);


const client = new ApolloClient({
  link,
  cache 
});

export default client;
