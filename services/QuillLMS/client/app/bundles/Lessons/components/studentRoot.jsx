import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Play from './classroomLessons/play/container.tsx';

const StudentRoot = () => (
  <Switch>
    <Route component={Play} path='/play/class-lessons/:lessonID' />
    <Route component={Play} path='/play/class-lessons' />
  </Switch>
)

export default StudentRoot;
