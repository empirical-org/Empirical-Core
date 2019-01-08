import * as path from 'path'
import { fileLoader } from 'merge-graphql-schemas'
import GraphQLJSON from 'graphql-type-json';

/*  AUTOMATED APPROACH: Put your resolvers anywhere 
    with ".resolvers.[js/ts]" naming convention */
const resolvers = fileLoader(path.join(__dirname, './**/*.resolvers.*'))
resolvers.push(GraphQLJSON);

export default resolvers