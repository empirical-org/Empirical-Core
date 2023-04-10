import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LessonPlannerContainer from './LessonPlannerContainer.jsx';

const LessonPlannerRouter = (props) => {
  return (
    <BrowserRouter>
      <Route path="/teachers/classrooms/activity_planner" render={routerProps => <LessonPlannerContainer {...routerProps} {...props} />} />
    </BrowserRouter>
  );
}

export default LessonPlannerRouter
