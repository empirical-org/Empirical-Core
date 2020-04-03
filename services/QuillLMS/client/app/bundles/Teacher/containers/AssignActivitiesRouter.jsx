import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AssignActivitiesContainer from './AssignActivitiesContainer.jsx'
import UnitTemplateAssigned from '../components/assignment_flow/unit_template_assigned'
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/assignment_flow/unit_templates_manager/unit_template_profile/unit_template_profile.tsx'
import AssignANewActivity from '../components/assignment_flow/create_unit/assign_a_new_activity'
import AssignADiagnostic from '../components/assignment_flow/create_unit/assign_a_diagnostic.tsx'
import CreateUnit from '../components/assignment_flow/create_unit/create_unit'
import LearningProcess from '../components/assignment_flow/create_unit/learning_process.tsx'
import ActivityType from '../components/assignment_flow/create_unit/activity_type.tsx'

const AssignActivitiesRouter = props => (
  <BrowserRouter>
    <Route component={AssignActivitiesContainer} path="/assign" />
    <Switch>
      <Route component={routerProps => <LearningProcess {...props} {...routerProps} />} path="/assign/learning-process" />
      <Route component={routerProps => <ActivityType {...props} {...routerProps} />} path="/assign/activity-type" />
      <Route component={routerProps => <AssignADiagnostic {...props} {...routerProps} />} path="/assign/diagnostic" />
      <Route component={routerProps => <CreateUnit {...props} {...routerProps} />} path="/assign/create-activity-pack" />
      <Route component={routerProps => <CreateUnit {...props} {...routerProps} />} path="/assign/select-classes" />
      <Route component={routerProps => <CreateUnit {...props} {...routerProps} />} path="/assign/referral" />
      <Route component={routerProps => <CreateUnit {...props} {...routerProps} />} path="/assign/add-students" />
      <Route component={routerProps => <CreateUnit {...props} {...routerProps} />} path="/assign/next" />
      <Route component={UnitTemplateAssigned} path="/assign/featured-activity-packs/:activityPackId/assigned" />
      <Route component={UnitTemplateProfile} path="/assign/featured-activity-packs/:activityPackId" />
      <Route component={UnitTemplatesManager} path="/assign/featured-activity-packs" />
      <Redirect from="/assign/featured-activity-packs/category/:category" to="/assign/featured-activity-packs" />
      <Redirect from="/assign/featured-activity-packs/grade/:grade" to="/assign/featured-activity-packs" />
      <Route component={routerProps => <CreateUnit {...props} {...routerProps} />} path="/assign/new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" />
      <Route component={routerProps => <AssignANewActivity {...props} {...routerProps} />} path="/assign" />
    </Switch>
  </BrowserRouter>
);

export default AssignActivitiesRouter
