import React from 'react';
import { Route, IndexRoute } from 'react-router';

import StudentRoot from '../components/studentRoot';
import StudentLesson from '../components/studentLessons/lesson.jsx';

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

const PlayRoutes = (
  <Route path="/teach" component={StudentRoot}>
    <Route path="class-lessons/" component={Passthrough}>
      <IndexRoute
        component={Passthrough}
        onEnter={
            (nextState, replaceWith) => {
              const classroom_activity_id = getParameterByName('classroom_activity_id');
              const lessonID = getParameterByName('uid');
              if (lessonID) {
                document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${lessonID}?&classroom_activity_id=${classroom_activity_id}`;
              }
            }
          }
      />
      <Route path=":lessonID" component={StudentLesson} />
    </Route>
  </Route>
);

export default PlayRoutes;
