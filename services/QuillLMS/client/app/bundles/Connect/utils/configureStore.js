import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/combined';
import { persistState } from '@redux-devtools/core';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createHashHistory from 'history/lib/createHashHistory';
import localForage from 'localforage';

const hashhistory = createHashHistory({ queryKey: false, });
const middleware = routerMiddleware(hashhistory);

const finalCreateStore = compose(
  // middleware you want to use in development:
  applyMiddleware(thunk, middleware),
  // required! Enable Redux DevTools with the monitors you chose
  // devTools.instrument(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

function getDebugSessionKey() {
  // you can write custom logic here!
  // by default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);
  if (module.hot) {
    module.hot.accept('../reducers/combined', () =>
      store.replaceReducer(require('../reducers/combined')/* .default if you use Babel 6+ */)
    );
  }

  return store;
}
