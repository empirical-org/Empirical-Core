import React from "react";
import { render } from 'react-dom'
import Root from "./components/root";
import Welcome from "./components/welcome/welcome.jsx";
import Play from "./components/play/play.jsx";
import Results from "./components/results/results.jsx";
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// const history = createBrowserHistory()
import createHashHistory from 'history/lib/createHashHistory'
const hashhistory = createHashHistory({ queryKey: false })
let store = createStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashhistory, store)

const root = document.getElementById('root')

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root}>
        <IndexRoute component={Welcome} />
        <Route path="/play" component={Play}/>
        <Route path="/results" component={Results}/>
      </Route>
    </Router>
  </Provider>),
  root
);
