import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import StudentProfile from './StudentProfileAppClient';
import JoinClass from './JoinClassAppClient';
import Study from './Study/index';

const StudentProfileRouter = props =>
  <Router history={browserHistory}>
    <Route path="profile" component={StudentProfile} />
    <Route path="classrooms/:classroomId" component={StudentProfile} />
    <Route path="add_classroom" component={JoinClass} />
    <Route path="study" component={Study} />
  </Router>;

export default StudentProfileRouter;
