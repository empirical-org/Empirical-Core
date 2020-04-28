import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import StudentProfile from './StudentProfileAppClient';
import JoinClass from './JoinClassAppClient';
import Study from './Study/index';

const StudentProfileRouter = props =>
  (<BrowserRouter>
    <Switch>
      <Route component={StudentProfile} path="/profile" />
      <Route component={StudentProfile} path="/classes" />
      <Route component={StudentProfile} path="/classrooms/:classroomId" />
      <Route component={JoinClass} path="/add_classroom" />
      <Route component={Study} path="/study" />
    </Switch>
  </BrowserRouter>);
  
export default StudentProfileRouter;
