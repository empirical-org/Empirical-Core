import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import LessonPlannerContainer from './LessonPlannerContainer';

const PublicUnitTemplatesRouter = () => {
  return(
    <BrowserRouter>
      <CompatRouter>
        <Route component={LessonPlannerContainer} path="/activities/packs" />
      </CompatRouter>
    </BrowserRouter>
  );
};

export default PublicUnitTemplatesRouter;
