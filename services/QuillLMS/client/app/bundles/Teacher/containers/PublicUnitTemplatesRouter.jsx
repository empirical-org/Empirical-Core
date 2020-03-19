import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import LessonPlannerContainer from './LessonPlannerContainer'
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/assignment_flow/unit_templates_manager/unit_template_profile/unit_template_profile.tsx'

const PublicUnitTemplatesRouter = () => {
  return(
    <Router history={browserHistory} Router>
      <Route component={LessonPlannerContainer} path="/activities/packs">
        <IndexRoute component={UnitTemplatesManager} />
        <Route component={UnitTemplatesManager} path="category/:category" />
        <Route component={UnitTemplatesManager} path="grade/:grade" />
        <Route component={UnitTemplateProfile} path=":activityPackId" />
      </Route>
    </Router>
  );
};

export default PublicUnitTemplatesRouter;
