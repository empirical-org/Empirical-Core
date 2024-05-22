import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import JoinClass from './JoinClassAppClient';
import StudentProfile from './StudentProfileAppClient';
import Study from './Study/index';

const StudentProfileRouter = props =>
  (<BrowserRouter>
    <CompatRouter>
      <Switch>
        <Route component={routerProps => <StudentProfile {...props} {...routerProps} />} path="/profile" />
        <Route component={routerProps => <StudentProfile {...props} {...routerProps} />} path="/classes" />
        <Route component={routerProps => <StudentProfile {...props} {...routerProps} />} path="/classrooms/:classroomId" />
        <Route component={routerProps => <JoinClass {...props} {...routerProps} />} path="/add_classroom" />
        <Route component={Study} path="/study" />
      </Switch>
    </CompatRouter>
  </BrowserRouter>);

export default StudentProfileRouter;
