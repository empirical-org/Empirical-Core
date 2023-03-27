import Promise from 'promise-polyfill';
import Raven from 'raven-js';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from './components/home';
import SocketProvider from './components/socketProvider';
import BackOff from './utils/backOff';
import createStore from './utils/configureStore';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

if (import.meta.env.RAILS_ENV === 'production') {
  Raven
    .config(
      'https://528794315c61463db7d5181ebc1d51b9@sentry.io/210579',
      {
        environment: import.meta.env.RAILS_ENV,
      }
    )
    .install();
}

BackOff();
const store = createStore();

const route = (
  <Switch>
    <Route component={Home} path="/" />
  </Switch>
);

const App = () => (
  <Provider store={store}>
    <SocketProvider>
      <HashRouter basename="/">{route}</HashRouter>
    </SocketProvider>
  </Provider>
)

export default App
