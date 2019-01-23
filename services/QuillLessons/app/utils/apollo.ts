import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT || 'http://localhost:7777'
});

export default client;