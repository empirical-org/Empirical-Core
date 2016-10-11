import BackOff from "./utils/backOff";
BackOff()
import React from "react";
import { render } from 'react-dom'
import Root from "./components/root";
import StudentRoot from "./components/studentRoot";
import Welcome from "./components/welcome/welcome.jsx";
import Play from "./components/play/play.jsx";
import PlayQuestion from "./components/play/playQuestion.jsx";
import Results from "./components/results/results.jsx";
import Review from "./components/results/review.jsx";
import Admin from "./components/admin/admin.jsx";
import ConceptsFeedback from "./components/feedback/concepts-feedback.jsx";
import ConceptFeedback from "./components/feedback/concept-feedback.jsx";
import Concepts from "./components/concepts/concepts.jsx";
import Concept from "./components/concepts/concept.jsx";
import Questions from "./components/questions/questions.jsx";
import Question from "./components/questions/question.jsx";
import DiagnosticQuestions from "./components/diagnosticQuestions/diagnosticQuestions.jsx";
import DiagnosticQuestion from "./components/diagnosticQuestions/diagnosticQuestion.jsx";
import SentenceFragments from "./components/sentenceFragments/sentenceFragments.jsx";
import NewSentenceFragment from "./components/sentenceFragments/newSentenceFragment.jsx";
import SentenceFragment from "./components/sentenceFragments/sentenceFragment.jsx";
import Activities from "./components/lessons/activities.jsx";
import Lessons from "./components/lessons/lessons.jsx";
import Lesson from "./components/lessons/lesson.jsx";
import LessonResults from "./components/lessons/lessonResults.jsx";
import Diagnostics from "./components/diagnostics/diagnostics.jsx";
import NewDiagnostic from "./components/diagnostics/new.jsx";
import ItemLevels from "./components/itemLevels/itemLevels.jsx";
import ItemLevel from "./components/itemLevels/itemLevel.jsx";
import ItemLevelForm from "./components/itemLevels/itemLevelForm.jsx";
import ItemLevelDetails from "./components/itemLevels/itemLevelDetails.jsx"
import StudentLesson from "./components/studentLessons/lesson.jsx";
import GameLesson from "./components/gameLessons/lesson.jsx";
import StudentDiagnostic from "./components/diagnostics/studentDiagnostic.jsx";
import PlaySentenceFragment from "./components/sentenceFragments/playSentenceFragment.jsx"
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';
import { Router, Route, IndexRoute, browserHistory, Redirect} from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import Turk from './components/turk/sentenceFragmentsQuiz.jsx'
import conceptActions from './actions/concepts'
import conceptsFeedbackActions from './actions/concepts-feedback'
import questionActions from './actions/questions'
import sentenceFragmentActions from './actions/sentenceFragments'
import pathwayActions from './actions/pathways'
import lessonActions from './actions/lessons'
import levelActions from './actions/item-levels'
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// const history = createBrowserHistory()
import createHashHistory from 'history/lib/createHashHistory'
const hashhistory = createHashHistory({ queryKey: false })
let store = createStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashhistory, store)

const root = document.getElementById('root')

const Passthrough = React.createClass({
  render: function() {
    return this.props.children
  }
})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

render((
  <Provider store={store}>
    <Router history={history}>
      {/*<Route path="/" component={Root}>*/}
        {/*<IndexRoute component={Welcome} />*/}

        <Route path="/play" component={StudentRoot}>
          <IndexRoute component={Play} />
          <Route path="turk" component={Turk}/>
          <Route path="turk/:lessonID" component={Turk}/>
          <Route path="game" component={Passthrough}>
            <IndexRoute component={Passthrough}
              onEnter={
                (nextState, replaceWith) => {
                  var lessonID = getParameterByName('uid');
                  var studentID = getParameterByName('student');
                  if(lessonID){
                    document.location.href = document.location.origin + document.location.pathname + "#/play/game/" + lessonID + "?student=" + studentID;
                  }
                }
              }
            />
            <Route path=":lessonID" component={GameLesson}/>
          </Route>
          <Route path="lesson" component={Passthrough}>
            <IndexRoute component={Passthrough}
              onEnter={
                (nextState, replaceWith) => {
                  var lessonID = getParameterByName('uid');
                  var studentID = getParameterByName('student');
                  if(lessonID){
                    document.location.href = document.location.origin + document.location.pathname + "#/play/lesson/" + lessonID + "?student=" + studentID;
                  }
                }
              }
            />
            <Route path=":lessonID" component={StudentLesson}/>
          </Route>

          <Route path="diagnostic/" component={StudentDiagnostic}/>
          <Route path="diagnostic/:diagnosticID" component={StudentDiagnostic}/>
          <Redirect from="diagnostic?student=:studentID&uid=:diagnosticID" to="/diagnostic/1" />

          <Route path="questions/:questionID" component={PlayQuestion}/>
          <Route path="sentence-fragments/:fragmentID" component={PlaySentenceFragment}/>
        </Route>
        <Route path="/lessons" component={Activities}/>
        <Route path="/results" component={Passthrough}>
          <IndexRoute component={Results}/>
          <Route path="questions/:questionID" component={Review}/>
        </Route>
        <Route path="/admin" component={Admin}>
          {/*Concepts section*/}
          <Route path="concepts" component={Concepts}/>
          <Route path="concepts/:conceptID" component={Concept}/>

          {/*Questions section*/}
          <Route path="questions" component={Questions}/>
          <Route path="questions/:questionID" component={Question}/>

          {/*Questions section*/}
          <Route path="diagnostic-questions" component={DiagnosticQuestions}/>
          <Route path="diagnostic-questions/:questionID" component={DiagnosticQuestion}/>

          {/*Sentence Fragment sections*/}
          <Route path="sentence-fragments" component={SentenceFragments}/>
          <Route path="sentence-fragments/new" component={NewSentenceFragment}/>
          <Route path="sentence-fragments/:sentenceFragmentID" component={SentenceFragment}/>

          {/*Lessons section*/}
          <Route path="lessons" component={Lessons}/>
          <Route path="lessons/:lessonID" component={Lesson}/>
          <Route path="lessons/:lessonID/results" component={LessonResults}/>

          {/* Diagnostics */}
          <Route path="diagnostics" component={Diagnostics}/>
          <Route path="diagnostics/new" component={NewDiagnostic}/>

          {/* Targeted Feedback */}
          <Route path="concepts-feedback" component={ConceptsFeedback}>
            <Route path=":feedbackID" component={ConceptFeedback}/>
          </Route>

          {/* Item Levels */}
          <Route path="item-levels" component={ItemLevels}/>
          <Route path="item-levels/new" component={ItemLevelForm}/>
          <Route path="item-levels/:itemLevelID" component={ItemLevelDetails}/>
          <Route path="item-levels/:itemLevelID/edit" component={ItemLevel}/>
        </Route>
      {/*</Route>*/}

    </Router>
  </Provider>),
  root
);

setTimeout(function(){
	store.dispatch( conceptActions.startListeningToConcepts() );
  store.dispatch( conceptsFeedbackActions.loadConceptsFeedback() );
  store.dispatch( questionActions.loadQuestions() );
  store.dispatch( sentenceFragmentActions.loadSentenceFragments() );
  store.dispatch( pathwayActions.loadPathways() );
  store.dispatch( lessonActions.loadLessons() );
  store.dispatch( levelActions.loadItemLevels() );
});
