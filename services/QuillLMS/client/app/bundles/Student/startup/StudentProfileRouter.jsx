import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import StudentProfile from './StudentProfileAppClient';
import JoinClass from './JoinClassAppClient';
import Study from './Study/index';

const StudentProfileRouter = props =>
  <Router history={browserHistory}>
    <Route component={StudentProfile} path="profile" />
    <Route component={StudentProfile} path="classrooms/:classroomId" />
    <Route component={JoinClass} path="add_classroom" />
    <Route component={Study} path="study" />
  </Router>;

export default StudentProfileRouter;
