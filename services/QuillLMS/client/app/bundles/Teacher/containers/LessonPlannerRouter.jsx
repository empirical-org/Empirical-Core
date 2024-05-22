import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import LessonPlannerContainer from './LessonPlannerContainer.jsx';

const LessonPlannerRouter = (props) => {
  return (
    <BrowserRouter>
      <CompatRouter>
        <Route path="/teachers/classrooms/activity_planner" render={routerProps => <LessonPlannerContainer {...routerProps} {...props} />} />
      </CompatRouter>
    </BrowserRouter>
  );
}

export default LessonPlannerRouter
