import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import LessonPlanner from './LessonPlanner.jsx'
import LessonPlannerContainer from './LessonPlannerContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import EmptyAssignedUnits from '../components/lesson_planner/manage_units/EmptyAssignedUnits.jsx'
import UnitTemplateAssigned from '../components/lesson_planner/unit_template_assigned'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/lesson_planner/unit_templates_manager/unit_template_profile/unit_template_profile'


export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teachers/classrooms/activity_planner" component={LessonPlannerContainer}>
					<IndexRoute component={LessonPlanner}/>
					{/* <Route path="featured-activity-packs(/category/:category)" component={UnitTemplatesManager}/>
					<Route path="featured-activity-packs(/grade/:grade)" component={UnitTemplatesManager}/>
					<Route path="featured-activity-packs/:activityPackId" component={UnitTemplateProfile}/>
					<Route path="featured-activity-packs/:activityPackId/assigned" component={UnitTemplateAssigned}/> */}
					<Route path="new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/students/edit" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/activities/edit(/:unitName)" component={EditUnitActivitiesContainer}/>
					<Route path="no_units" component={EmptyAssignedUnits}/>
        </Route>
			</Router>
		);
	}
});
