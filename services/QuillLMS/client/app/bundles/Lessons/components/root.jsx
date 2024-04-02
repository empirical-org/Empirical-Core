import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Teach from './classroomLessons/teach/container.tsx';
import MarkingLessonAsCompleted from './classroomLessons/teach/markingLessonAsCompleted.tsx';

const Root = () => {
  return (
    <Switch>
      <Route component={Teach} path='/teach/class-lessons/:lessonID/preview/:editionID' />
      <Route component={Teach} path='/teach/class-lessons/:lessonID/preview' />
      <Route component={MarkingLessonAsCompleted} path='/teach/class-lessons/:lessonID/mark_lesson_as_completed' />
      <Route component={Teach} path='/teach/class-lessons/:lessonID' />
    </Switch>
  );
};

export default withRouter(Root);
