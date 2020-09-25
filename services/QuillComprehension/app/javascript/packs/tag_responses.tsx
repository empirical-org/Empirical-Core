import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Provider } from 'react-redux'

import store from '../src/lib/createStore'
import TagResponsesContainer from '../src/components/responses'

const client = new ApolloClient({});

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <TagResponsesContainer question_id={document.getElementById('tagger-target').dataset.questionId} />
      </ApolloProvider>
    </Provider>,
    document.getElementById('tagger-target'),
  )
})