import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import StudentProfile from './StudentProfileAppClient'
// import JoinClass from './JoinClassAppClient'
// import AccountSettings from './AccountSettingsAppClient'

const StudentProfileRouter = props =>
  <Router Router history={browserHistory}>
    {/* <Route path="profile" component={StudentProfile} /> */}
    <Route path="classrooms/:classroomId" component={StudentProfile} />
    {/* <Route path="students_classrooms/add_classroom" component={JoinClass} />
    <Route path="account_settings" component={AccountSettings} /> */}
  </Router>

export default StudentProfileRouter
