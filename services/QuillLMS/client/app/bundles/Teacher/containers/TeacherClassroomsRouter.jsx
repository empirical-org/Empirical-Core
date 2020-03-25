import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ActiveClassrooms from '../components/classrooms/active_classrooms.tsx'
import ArchivedClassrooms from '../components/classrooms/archived_classrooms.tsx'

const TeacherClassroomsRouter = props => (
  <BrowserRouter>
    <Switch>
      <Route component={() => <ArchivedClassrooms {...props} />} path="/teachers/classrooms/archived" />
      <Route exact path="/teachers/classrooms" component={() => <ActiveClassrooms {...props} />} />
    </Switch>
  </BrowserRouter>
)

export default TeacherClassroomsRouter
