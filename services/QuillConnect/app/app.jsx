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

// This is pretty hacky.
// Ideally we should really be extracting the lesson UID from
// the Router, but because we populate redux so early in the
// code stack (i.e. right below) we need access to the UID
// outside of the Router's scope, so we have this work-around
// rather than shuffling the redux initialization around.
// TODO: At some point we should figure out how to more strictly
// separate the admin and lesson side of the apps so that we
// don't have this unified store definition.
function extractLessonUIDFromLocation() {
  const playRegex = /^#\/play\/(lesson|turk)\/([^\?]+)/;
  const matches = window.location.hash.match(playRegex);
  return (matches) ? matches[2] : null;
}

const lessonUid = extractLessonUIDFromLocation()



// During our rollout, we want to limit the number of people this
// could impact if things go wrong.  So we're only going to apply
// this new process to a small percentage of sessions.  This does
// mean that a single user could get a mix of session types in the
// same day, but since sessions will be invisible if they work,
// that shouldn't matter.

function simpleHash(str) {
  // NOTE: This entire function is lifted from the "string-hash" module
  // on NPM, but I didn't want to add a new dependency for temporary code
  // so I simply re-implemented it here.
  // Source: https://github.com/darkskyapp/string-hash/blob/master/index.js
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

// This is the whole number percentage of users who will be assigned
// to the new session type.
const percentAssigned = 10;
const sessionIDmatch = window.location.hash.match(/\?student=(.*)$/)
const sessionID = (sessionIDmatch === null || sessionIDmatch[1] === 'null') ? null : sessionIDmatch[1];



if (lessonUid && sessionID && simpleHash(sessionID) % 100 < percentAssigned) {
  setTimeout(() => {
    store.dispatch(conceptActions.startListeningToConcepts());
    store.dispatch(conceptsFeedbackActions.loadConceptsFeedback());
    store.dispatch(lessonActions.loadLessonWithQuestions(lessonUid));
  });
} else {
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
}

String.prototype.quillNormalize = quillNormalizer;
