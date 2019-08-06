import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import ActiveClassrooms from '../components/classrooms/active_classrooms.tsx'
import ArchivedClassrooms from '../components/classrooms/archived_classrooms.tsx'

const TeacherClassroomsRouter = props => (
  <Router Router history={browserHistory}>
    <Route path="/teachers/classrooms/new_index">
      <IndexRoute component={() => <ActiveClassrooms {...props} />} />
      <Route path="archived" component={() => <ArchivedClassrooms {...props} />} />
    </Route>
  </Router>
)

export default TeacherClassroomsRouter
