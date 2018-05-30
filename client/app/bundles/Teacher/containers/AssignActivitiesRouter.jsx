import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import AssignActivitiesContainer from './AssignActivitiesContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import EmptyAssignedUnits from '../components/lesson_planner/manage_units/EmptyAssignedUnits.jsx'
import UnitTemplateAssigned from '../components/lesson_planner/unit_template_assigned'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/lesson_planner/unit_templates_manager/unit_template_profile/unit_template_profile'
import AssignANewActivity from '../components/lesson_planner/create_unit/assign_a_new_activity'
import AssignADiagnostic from '../components/lesson_planner/create_unit/assign_a_diagnostic'
import CreateUnit from '../components/lesson_planner/create_unit/create_unit'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teachers/classrooms/assign_activities" component={AssignActivitiesContainer}>
					<IndexRoute component={AssignANewActivity}/>
					<Route path="assign-a-diagnostic" component={AssignADiagnostic} />
					<Route path="create-unit" component={CreateUnit} />
					<Route path="featured-activity-packs(/category/:category)" component={UnitTemplatesManager}/>
					<Route path="featured-activity-packs(/grade/:grade)" component={UnitTemplatesManager}/>
					<Route path="featured-activity-packs/:activityPackId" component={UnitTemplateProfile}/>
					<Route path="featured-activity-packs/:activityPackId/assigned" component={UnitTemplateAssigned}/>
					<Route path="new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" component={ClassroomsWithStudentsContainer}/>
        </Route>
			</Router>
		);
	}
});
