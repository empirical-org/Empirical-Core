import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import ActiveClassrooms from '../components/classrooms/active_classrooms.tsx'
import ArchivedClassrooms from '../components/classrooms/archived_classrooms.tsx'

const TeacherClassroomsRouter = props => (
  <Router history={browserHistory} Router>
    <Route path="/teachers/classrooms">
      <IndexRoute component={() => <ActiveClassrooms {...props} />} />
      <Route component={() => <ArchivedClassrooms {...props} />} path="archived" />
    </Route>
  </Router>
)

export default TeacherClassroomsRouter
