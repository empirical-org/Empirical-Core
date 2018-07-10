import 'babel-polyfill';
import Promise from 'promise-polyfill';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}
import BackOff from './utils/backOff';
import React from 'react';
import { render } from 'react-dom';
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import conceptActions from './actions/concepts';
import conceptsFeedbackActions from './actions/concepts-feedback';
import questionActions from './actions/questions';
import fillInBlankActions from './actions/fillInBlank';
import sentenceFragmentActions from './actions/sentenceFragments';
import lessonActions from './actions/lessons';
import levelActions from './actions/item-levels';
import * as titleCardActions from './actions/titleCards.ts';
import createHashHistory from 'history/lib/createHashHistory';
import 'styles/style.scss';
import Raven from 'raven-js';
import quillNormalizer from './libs/quillNormalizer';
import SocketProvider from './components/socketProvider';

if (process.env.NODE_ENV === 'production') {
  console.log('App is running in production');
  Raven
  .config(
    'https://528794315c61463db7d5181ebc1d51b9@sentry.io/210579',
    {
      environment: process.env.NODE_ENV,
    }
  )
  .install();
}

BackOff();
const hashhistory = createHashHistory({ queryKey: false, });
const store = createStore();

// create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashhistory, store);
const root = document.getElementById('root');
const rootRoute = {
  childRoutes: [{
    path: '/',
    childRoutes: [
      require('./routers/Admin/index').default,
      require('./routers/Play/index').default
    ],
  }],
};

render((
  <Provider store={store}>
    <Router history={history} routes={rootRoute} />
  </Provider>),
  root
);

setTimeout(() => {
  store.dispatch(conceptActions.startListeningToConcepts());
  store.dispatch(conceptsFeedbackActions.loadConceptsFeedback());
  store.dispatch(questionActions.loadQuestions());
  store.dispatch(fillInBlankActions.loadQuestions());
  store.dispatch(sentenceFragmentActions.loadSentenceFragments());
  store.dispatch(levelActions.loadItemLevels());
  store.dispatch(lessonActions.startListeningToLessons());
  store.dispatch(titleCardActions.loadTitleCards());
});

String.prototype.quillNormalize = quillNormalizer;
