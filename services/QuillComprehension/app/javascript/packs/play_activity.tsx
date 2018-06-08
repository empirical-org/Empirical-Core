import * as React from 'react'
import * as ReactDOM from 'react-dom'
import gql from "graphql-tag";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import ActivityContainer from '../src/components/activities'

const client = new ApolloClient({});

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ActivityContainer activity_id={document.getElementById('target').dataset.activityId}/>
    </ApolloProvider>,
    document.getElementById('target'),
  )
})