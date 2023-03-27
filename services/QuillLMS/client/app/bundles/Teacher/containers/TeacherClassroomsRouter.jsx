import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ActiveClassrooms from '../components/classrooms/active_classrooms.tsx';
import ArchivedClassrooms from '../components/classrooms/archived_classrooms.tsx';

const TeacherClassroomsRouter = props => (
  <BrowserRouter>
    <Switch>
      <Route component={() => <ArchivedClassrooms {...props} />} path="/teachers/classrooms/archived" />
      <Route component={() => <ActiveClassrooms {...props} />} exact path="/teachers/classrooms" />
    </Switch>
  </BrowserRouter>
)

export default TeacherClassroomsRouter
