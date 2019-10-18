import React from 'react';
import ConceptsIndex from '../containers/ConceptsIndex';
import ConceptsNew from '../containers/ConceptsNew';
import ConceptsFindAndReplace from '../containers/ConceptsFindAndReplace';
import ConceptsChangeLogIndex from '../containers/ConceptsChangeLogIndex'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { ApolloProvider } from "react-apollo";
import client from '../../../modules/apollo';

const container = (props) => (
  <div>{props.children}</div>
)

export default () => (
  <ApolloProvider client={client}>
    <Router history={hashHistory}>
      <Route component={container} path="/">
        <IndexRoute component={ConceptsIndex} />
        <Route component={ConceptsNew} path="new" />
        <Route component={ConceptsFindAndReplace} path="find_and_replace" />
        <Route component={ConceptsChangeLogIndex} path="change_log" />
      </Route>
    </Router>
  </ApolloProvider>
);
