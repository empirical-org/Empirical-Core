import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router'
import AssignActivitiesContainer from './AssignActivitiesContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import EmptyAssignedUnits from '../components/assignment_flow/manage_units/EmptyAssignedUnits.jsx'
import UnitTemplateAssigned from '../components/assignment_flow/unit_template_assigned'
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/assignment_flow/unit_templates_manager/unit_template_profile/unit_template_profile'
import AssignANewActivity from '../components/assignment_flow/create_unit/assign_a_new_activity'
import AssignADiagnostic from '../components/assignment_flow/create_unit/assign_a_diagnostic.tsx'
import CreateUnit from '../components/assignment_flow/create_unit/create_unit'

const AssignActivitiesRouter = props => (
	<Router Router history={browserHistory}>
    <Route path="/teachers/classrooms/assign_activities" component={AssignActivitiesContainer}>
			<IndexRoute component={AssignANewActivity}/>
			<Route path="assign-a-diagnostic" component={AssignADiagnostic} />
			<Route path="create-unit" component={routerProps => <CreateUnit {...props} {...routerProps} />} />
			<Route path="featured-activity-packs" component={UnitTemplatesManager}/>
			<Redirect from="featured-activity-packs/category/:category" to="featured-activity-packs" />
			<Redirect from="featured-activity-packs/grade/:grade" to="featured-activity-packs" />
			<Route path="featured-activity-packs/:activityPackId" component={UnitTemplateProfile} />
			<Route path="featured-activity-packs/:activityPackId/assigned" component={UnitTemplateAssigned}/>
			<Route path="new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" component={routerProps => <CreateUnit {...props} {...routerProps} />} />
    </Route>
	</Router>
);

export default AssignActivitiesRouter
