import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/combined';
import DevTools from './devTools';
import { persistState } from 'redux-devtools';
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux'
import createHashHistory from 'history/lib/createHashHistory'
import localForage from 'localForage'
const hashhistory = createHashHistory({ queryKey: false })
const middleware = routerMiddleware(hashhistory);

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunk, middleware),
  // Required! Enable Redux DevTools with the monitors you chose
  // DevTools.instrument(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export default function configureStore(initialState) {
  console.log("creating store")
  const store = finalCreateStore(rootReducer, initialState, autoRehydrate());
  console.log("persisting store")
  persistStore(store, {storage: localForage})
  console.log("persisted store")
  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers/combined', () =>
      store.replaceReducer(require('../reducers/combined')/*.default if you use Babel 6+ */)
    );
  }

  return store;
}
