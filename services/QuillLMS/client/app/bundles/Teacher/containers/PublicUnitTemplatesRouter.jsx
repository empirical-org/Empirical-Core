import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LessonPlannerContainer from './LessonPlannerContainer';

const PublicUnitTemplatesRouter = () => {
  return(
    <BrowserRouter>
      <Route component={LessonPlannerContainer} path="/activities/packs" />
    </BrowserRouter>
  );
};

export default PublicUnitTemplatesRouter;
