import React from "react";
import { render } from 'react-dom'
import Root from "./components/root";
import Welcome from "./components/welcome/welcome.jsx";
import Play from "./components/play/play.jsx";
import PlayQuestion from "./components/play/playQuestion.jsx";
import Lesson from "./components/lesson/lesson.jsx";
import Results from "./components/results/results.jsx";
import Admin from "./components/admin/admin.jsx";
import Concepts from "./components/concepts/concepts.jsx";
import Concept from "./components/concepts/concept.jsx";
import Questions from "./components/questions/questions.jsx";
import Question from "./components/questions/question.jsx";
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import conceptActions from './actions/concepts'
import questionActions from './actions/questions'
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
          <Route path="lesson/:id" component={Lesson}/>
          <Route path="questions/:questionID" component={PlayQuestion}/>
        </Route>
        <Route path="results" component={Results}/>
        <Route path="admin" component={Passthrough}>
          <IndexRoute component={Admin} />
          <Route path="concepts" component={Concepts}>
            <Route path=":conceptID" component={Concept}/>
          </Route>
          <Route path="questions" component={Questions}>
            <Route path=":questionID" component={Question}/>
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
});
