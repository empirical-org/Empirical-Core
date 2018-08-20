import React from 'react';
import ConceptsIndex from '../containers/ConceptsIndex';
import ConceptsShow from '../containers/ConceptsShow';
import ConceptsNew from '../containers/ConceptsNew';
import ConceptsEdit from '../containers/ConceptsEdit';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { ApolloProvider } from "react-apollo";
import client from '../../../modules/apollo';


const container = (props) => (
  <div style={{paddingTop: 25}}>{props.children}</div>
)

export default () => (
  <ApolloProvider client={client}>
    <Router Router history={hashHistory}>
      <Route path="/" component={container}>
        <IndexRoute component={ConceptsIndex}/>
        <Route path="new" component={ConceptsNew}/>
        <Route path=":id" component={ConceptsShow}/>
        <Route path=":id/edit" component={ConceptsEdit}/>
      </Route>
    </Router>
  </ApolloProvider>
);

