import React from "react";
import { render } from 'react-dom'
import Root from "./components/root";
import Welcome from "./components/welcome/welcome.jsx";
import Play from "./components/play/play.jsx";
import PlayQuestion from "./components/play/playQuestion.jsx";
import Results from "./components/results/results.jsx";
import Review from "./components/results/review.jsx";
import Admin from "./components/admin/admin.jsx";
import Concepts from "./components/concepts/concepts.jsx";
import Concept from "./components/concepts/concept.jsx";
import Questions from "./components/questions/questions.jsx";
import Question from "./components/questions/question.jsx";
import Lessons from "./components/lessons/lessons.jsx";
import Lesson from "./components/lessons/lesson.jsx";
import StudentLesson from "./components/studentLessons/lesson.jsx";
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import conceptActions from './actions/concepts'
import questionActions from './actions/questions'
import pathwayActions from './actions/pathways'
import lessonActions from './actions/lessons'
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

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root}>
        <IndexRoute component={Welcome} />
        <Route path="play" component={Passthrough}>
          <IndexRoute component={Play} />
          <Route path="lesson/:lessonID" component={StudentLesson}/>
          <Route path="questions/:questionID" component={PlayQuestion}/>
        </Route>
        <Route path="lessons" component={Passthrough}>

        </Route>
        <Route path="results" component={Passthrough}>
          <IndexRoute component={Results}/>
          <Route path="questions/:questionID" component={Review}/>
        </Route>
        <Route path="admin" component={Admin}>

          <Route path="concepts" component={Concepts}>
            <Route path=":conceptID" component={Concept}/>
          </Route>
          <Route path="questions" component={Questions}>
            <Route path=":questionID" component={Question}/>
          </Route>
          <Route path="lessons" component={Lessons}>
            <Route path=":lessonID" component={Lesson}/>
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>),
  root
);

setTimeout(function(){
	store.dispatch( conceptActions.startListeningToConcepts() );
  store.dispatch( questionActions.startListeningToQuestions() );
  store.dispatch( pathwayActions.startListeningToPathways() );
  store.dispatch( lessonActions.startListeningToLessons() );
});
