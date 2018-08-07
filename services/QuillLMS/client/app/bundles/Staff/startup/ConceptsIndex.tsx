import React from 'react';
import ConceptsIndex from '../containers/ConceptsIndex';
import ConceptsShow from './ConceptsShow';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router'
import { ApolloProvider } from "react-apollo";
import client from '../../../modules/apollo';


const container = (props) => (
  <div>{props.children}</div>
)

export default () => (
  <ApolloProvider client={client}>
    <Router Router history={hashHistory}>
      <Route path="/" component={container}>
        <IndexRoute component={ConceptsIndex}/>
        <Route path=":id" component={ConceptsShow}/>
      </Route>
    </Router>
  </ApolloProvider>
);

