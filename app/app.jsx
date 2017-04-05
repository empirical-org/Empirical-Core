import BackOff from './utils/backOff';
import React from 'react';
import { render } from 'react-dom';
import Results from './components/results/results.jsx';
import Review from './components/results/review.jsx';
import Activities from './components/lessons/activities.jsx';
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import conceptActions from './actions/concepts';
import conceptsFeedbackActions from './actions/concepts-feedback';
import questionActions from './actions/questions';
import sentenceFragmentActions from './actions/sentenceFragments';
import lessonActions from './actions/lessons';
import levelActions from './actions/item-levels';
import AdminRoutes from './routers/admin-router.jsx';
import PlayRoutes from './routers/play-router.jsx';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// const history = createBrowserHistory()
import createHashHistory from 'history/lib/createHashHistory';
BackOff();
const hashhistory = createHashHistory({ queryKey: false, });
const store = createStore();

// create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashhistory, store);

const root = document.getElementById('root');

const Passthrough = React.createClass({
  render() {
    return this.props.children;
  },
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

render((
  <Provider store={store}>
    <Router history={history}>

      {PlayRoutes}
      <Route path="/results" component={Passthrough}>
        <IndexRoute component={Results} />
        <Route path="questions/:questionID" component={Review} />
      </Route>
      {AdminRoutes}
      {/* </Route>*/}

    </Router>
  </Provider>),
  root
);

setTimeout(() => {
  store.dispatch(conceptActions.startListeningToConcepts());
  store.dispatch(conceptsFeedbackActions.loadConceptsFeedback());
  store.dispatch(questionActions.loadQuestions());
  store.dispatch(sentenceFragmentActions.loadSentenceFragments());
  // store.dispatch( pathwayActions.loadPathways() );
  store.dispatch(lessonActions.loadLessons());
  store.dispatch(levelActions.loadItemLevels());
});
