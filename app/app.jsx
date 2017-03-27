import BackOff from './utils/backOff';
BackOff();
import React from 'react';
import { render } from 'react-dom';
import Root from './components/root';
import StudentRoot from './components/studentRoot';
import Welcome from './components/welcome/welcome.jsx';
import Play from './components/play/play.jsx';
import PlayQuestion from './components/play/playQuestion.jsx';
import Results from './components/results/results.jsx';
import Review from './components/results/review.jsx';
import Admin from './components/admin/admin.jsx';
import ConceptsFeedback from './components/feedback/concepts-feedback.jsx';
import ConceptFeedback from './components/feedback/concept-feedback.jsx';
import Concepts from './components/concepts/concepts.jsx';
import Concept from './components/concepts/concept.jsx';
import ScoreAnalysis from './components/scoreAnalysis/scoreAnalysis.jsx';
import Questions from './components/questions/questions.jsx';
import Question from './components/questions/question.jsx';
import DiagnosticQuestions from './components/diagnosticQuestions/diagnosticQuestions.jsx';
import DiagnosticQuestion from './components/diagnosticQuestions/diagnosticQuestion.jsx';
import SentenceFragments from './components/sentenceFragments/sentenceFragments.jsx';
import NewSentenceFragment from './components/sentenceFragments/newSentenceFragment.jsx';
import SentenceFragment from './components/sentenceFragments/sentenceFragment.jsx';
import Activities from './components/lessons/activities.jsx';
import Lessons from './components/lessons/lessons.jsx';
import Lesson from './components/lessons/lesson.jsx';
import LessonResults from './components/lessons/lessonResults.jsx';
import Diagnostics from './components/diagnostics/diagnostics.jsx';
import NewDiagnostic from './components/diagnostics/new.jsx';
import ItemLevels from './components/itemLevels/itemLevels.jsx';
import ItemLevel from './components/itemLevels/itemLevel.jsx';
import ItemLevelForm from './components/itemLevels/itemLevelForm.jsx';
import ItemLevelDetails from './components/itemLevels/itemLevelDetails.jsx';
import StudentLesson from './components/studentLessons/lesson.jsx';
import GameLesson from './components/gameLessons/lesson.jsx';
import StudentDiagnostic from './components/diagnostics/studentDiagnostic.jsx';
import ESLDiagnostic from './components/eslDiagnostic/studentDiagnostic.jsx';
import PlaySentenceFragment from './components/sentenceFragments/playSentenceFragment.jsx';
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import Turk from './components/turk/sentenceFragmentsQuiz.jsx';
import conceptActions from './actions/concepts';
import conceptsFeedbackActions from './actions/concepts-feedback';
import questionActions from './actions/questions';
import sentenceFragmentActions from './actions/sentenceFragments';
import pathwayActions from './actions/pathways';
import lessonActions from './actions/lessons';
import levelActions from './actions/item-levels';

import AdminRoutes from './routers/admin-router.jsx';
import PlayRoutes from './routers/play-router.jsx';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// const history = createBrowserHistory()
import createHashHistory from 'history/lib/createHashHistory';
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
      {/* <Route path="/" component={Root}>*/}
      {/* <IndexRoute component={Welcome} />*/}

      {PlayRoutes}
      <Route path="/lessons" component={Activities} />
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
