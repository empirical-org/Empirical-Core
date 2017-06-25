import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Play from '../components/play/play.jsx';
import PlayQuestion from '../components/play/playQuestion.jsx';
import StudentRoot from '../components/studentRoot';
// import StudentLesson from '../components/studentLessons/lesson.jsx';
import GameLesson from '../components/gameLessons/lesson.jsx';
// import StudentDiagnostic from '../components/diagnostics/studentDiagnostic.jsx';
// import ESLDiagnostic from '../components/eslDiagnostic/studentDiagnostic.jsx';
import PlaySentenceFragment from '../components/sentenceFragments/playSentenceFragment.jsx';
import Turk from '../components/turk/sentenceFragmentsQuiz.jsx';
import { getParameterByName } from '../libs/getParameterByName';

const Passthrough = React.createClass({
  render() {
    return this.props.children;
  },
});

// function getStudentComponent() {
//   require.ensure([], (require) => {
//     const StudentComponent = require('../components/studentLessons/lesson.jsx');
//     console.log(StudentComponent);
//     return cb(null, StudentComponent);
//   });
// }

const PlayRoutes = (
  <Route path="/play" component={StudentRoot}>
    <IndexRoute component={Play} />
    <Route path="turk" component={Turk} />
    <Route path="turk/:lessonID" component={Turk} />
    <Route path="game" component={Passthrough}>
      <IndexRoute
        component={Passthrough}
        onEnter={
            (nextState, replaceWith) => {
              const lessonID = getParameterByName('uid');
              const studentID = getParameterByName('student');
              if (lessonID) {
                document.location.href = `${document.location.origin + document.location.pathname}#/play/game/${lessonID}?student=${studentID}`;
              }
            }
          }
      />
      <Route path=":lessonID" component={GameLesson} />
    </Route>
    <Route path="lesson" component={Passthrough}>
      <IndexRoute
        component={Passthrough}
        onEnter={
            (nextState, replaceWith) => {
              const lessonID = getParameterByName('uid');
              const studentID = getParameterByName('student');
              if (lessonID) {
                document.location.href = `${document.location.origin + document.location.pathname}#/play/lesson/${lessonID}?student=${studentID}`;
              }
            }
          }
      />
      <Route
        path=":lessonID" getComponent={(location, callback) => {
          System.import('../components/studentLessons/lesson.jsx')
          .then((component) => {
            callback(null, component.default);
          });
        }}
      />
    </Route>

    <Route path="diagnostic" component={Passthrough}>
      <IndexRoute
        component={Passthrough}
        onEnter={
            (nextState, replaceWith) => {
              const lessonID = getParameterByName('uid');
              const studentID = getParameterByName('student');
              if (lessonID) {
                document.location.href = `${document.location.origin + document.location.pathname}#/play/diagnostic/${lessonID}?student=${studentID}`;
              }
            }
          }
      />
      <Route
        path="ell" getComponent={(location, callback) => {
          System.import('../components/eslDiagnostic/studentDiagnostic.jsx')
          .then((component) => {
            callback(null, component.default);
          });
        }}
      />

      <Route
        path=":diagnosticID" getComponent={(location, callback) => {
          System.import('../components/diagnostics/studentDiagnostic.jsx')
          .then((component) => {
            callback(null, component.default);
          });
        }}
      />
    </Route>
    {/* <Route path="diagnostic/esl" component={ESLDiagnostic}/>
      <Route path="diagnostic/:diagnosticID" component={StudentDiagnostic}/>
      <Redirect from="diagnostic?student=:studentID&uid=:diagnosticID" to="/diagnostic/:diagnosticID" /> */}

    <Route path="questions/:questionID" component={PlayQuestion} />
    <Route path="sentence-fragments/:fragmentID" component={PlaySentenceFragment} />
  </Route>
);

export default PlayRoutes;
