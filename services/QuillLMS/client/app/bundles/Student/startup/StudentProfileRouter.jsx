import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import StudentProfile from './StudentProfileAppClient'
import JoinClass from './JoinClassAppClient'

const StudentProfileRouter = props =>
  <Router Router history={browserHistory}>
    <Route path="profile" component={StudentProfile} />
    <Route path="classrooms/:classroomId" component={StudentProfile} />
    <Route path="add_classroom" component={JoinClass} />
  </Router>

export default StudentProfileRouter
