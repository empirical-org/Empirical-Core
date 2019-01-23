import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT || 'http://localhost:7777/graphql'
});

export default client;