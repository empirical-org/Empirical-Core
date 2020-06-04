import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import NavBar from './navbar/navbar';
import MarkingLessonAsCompleted from './classroomLessons/teach/markingLessonAsCompleted.tsx'
import Teach from './classroomLessons/teach/container.tsx'

const Root = ({ match }) => {
  return (
    <div>
      <NavBar match={match} />
      <Switch>
        <Route component={Teach} path='/teach/class-lessons/:lessonID/preview/:editionID' />
        <Route component={Teach} path='/teach/class-lessons/:lessonID/preview' />
        <Route component={MarkingLessonAsCompleted} path='/teach/class-lessons/:lessonID/mark_lesson_as_completed' />
        <Route component={Teach} path='/teach/class-lessons/:lessonID' />
      </Switch>
    </div>
  );
};

export default withRouter(Root);
