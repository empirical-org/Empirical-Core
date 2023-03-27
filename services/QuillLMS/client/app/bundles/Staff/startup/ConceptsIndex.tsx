import React from 'react';
import { ApolloProvider } from "react-apollo";
import { HashRouter, Route } from 'react-router-dom';
import client from '../../../modules/apollo';
import ConceptsChangeLogIndex from '../containers/ConceptsChangeLogIndex';
import ConceptsFindAndReplace from '../containers/ConceptsFindAndReplace';
import ConceptsIndex from '../containers/ConceptsIndex';
import ConceptsNew from '../containers/ConceptsNew';

export default () => (
  <ApolloProvider client={client}>
    <HashRouter>
      <Route component={ConceptsNew} path="/new" />
      <Route component={ConceptsFindAndReplace} path="/find_and_replace" />
      <Route component={ConceptsChangeLogIndex} path="/change_log" />
      <Route component={ConceptsIndex} exact path="/" />
    </HashRouter>
  </ApolloProvider>
);
