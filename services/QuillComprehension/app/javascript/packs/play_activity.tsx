import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Provider } from 'react-redux'

import store from '../src/lib/createStore'
import ActivityContainer from '../src/components/activities'

const client = new ApolloClient({});

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ActivityContainer activity_id={document.getElementById('target').dataset.activityId} />
      </ApolloProvider>
    </Provider>,
    document.getElementById('target'),
  )
})