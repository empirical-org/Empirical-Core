import createHashHistory from 'history/lib/createHashHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/combined';

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
  // TODO: remove, after Vite migration
  // if (module.hot) {
  //   module.hot.accept('../reducers/combined', () =>
  //     store.replaceReducer(require('../reducers/combined')/* .default if you use Babel 6+ */)
  //   );
  // }

  return store;
}
