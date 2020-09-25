import React from 'react';
import { HashRouter, Route,  } from 'react-router-dom'
import { ApolloProvider } from "react-apollo";

import ConceptsIndex from '../containers/ConceptsIndex';
import ConceptsNew from '../containers/ConceptsNew';
import ConceptsFindAndReplace from '../containers/ConceptsFindAndReplace';
import ConceptsChangeLogIndex from '../containers/ConceptsChangeLogIndex'
import client from '../../../modules/apollo';

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
