import Promise from 'promise-polyfill';
import Raven from 'raven-js';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import Home from './components/home';
import SocketProvider from './components/socketProvider';
import BackOff from './utils/backOff';
import createStore from './utils/configureStore';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

if (process.env.RAILS_ENV === 'production') {
  Raven
    .config(
      'https://528794315c61463db7d5181ebc1d51b9@sentry.io/210579',
      {
        environment: process.env.RAILS_ENV,
      }
    )
    .install();
}

BackOff();
const store = createStore();

const route = (
  <CompatRouter>
    <Switch>
      <Route component={Home} path="/" />
    </Switch>
  </CompatRouter>
);

const App = () => (
  <Provider store={store}>
    <SocketProvider>
      <HashRouter basename="/">{route}</HashRouter>
    </SocketProvider>
  </Provider>
)

export default App
