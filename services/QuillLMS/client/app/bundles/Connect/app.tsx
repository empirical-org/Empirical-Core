import Promise from 'promise-polyfill';
import { QueryClient, QueryClientProvider } from 'react-query'
import * as React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import * as Sentry from '@sentry/browser';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}
import BackOff from './utils/backOff';
import createStore from './utils/configureStore';
import conceptActions from './actions/concepts';
import conceptsFeedbackActions from './actions/concepts-feedback';
import questionActions from './actions/questions';
import fillInBlankActions from './actions/fillInBlank';
import sentenceFragmentActions from './actions/sentenceFragments';
import lessonActions from './actions/lessons';
import titleCardActions from './actions/titleCards.ts';
import quillNormalizer from './libs/quillNormalizer';
import Home from './components/home.tsx';

import { DefaultReactQueryClient } from '../Shared';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://528794315c61463db7d5181ebc1d51b9@o95148.ingest.sentry.io/210579' })
}

BackOff();
const store = createStore();
const queryClient = new DefaultReactQueryClient();

// This is pretty hacky.
// Ideally we should really be extracting the both UIDs from
// the Router, but because we populate redux so early in the
// code stack (i.e. right below) we need access to the UIDs
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

const lessonUid = extractLessonUIDFromLocation();

if (lessonUid) {
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
    store.dispatch(lessonActions.startListeningToLessons());
    store.dispatch(titleCardActions.loadTitleCards());
  });
}

String.prototype.quillNormalize = quillNormalizer;

const route = (
  <Switch>
    <Route component={Home} path="/" />
  </Switch>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Provider store={store}>
        <HashRouter basename="/">{route}</HashRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
