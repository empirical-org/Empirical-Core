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
      <Route path="/" component={container}>
        <IndexRoute component={ConceptsIndex}/>
        <Route path="new" component={ConceptsNew}/>
        <Route path="find_and_replace" component={ConceptsFindAndReplace}/>
        <Route path="change_log" component={ConceptsChangeLogIndex}/>
      </Route>
    </Router>
  </ApolloProvider>
);
