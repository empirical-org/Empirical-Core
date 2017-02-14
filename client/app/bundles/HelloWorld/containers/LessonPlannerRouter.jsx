import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import LessonPlanner from './LessonPlanner.jsx'
import LessonPlannerContainer from './LessonPlannerContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import EmptyAssignedUnits from '../components/lesson_planner/manage_units/EmptyAssignedUnits.jsx'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
import UnitTemplatesMini from '../components/lesson_planner/unit_templates_manager/unit_template_minis/unit_template_minis'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={hashHistory}>
        <Route path="/" component={LessonPlannerContainer}>
					<IndexRoute component={LessonPlanner}/>
					<Route path="/tab/featured-activity-packs" component={UnitTemplatesManager}/>
					<Route path="/tab/featured-activity-packs/category/:category"  component={UnitTemplatesMini}/>
					<Route path="/tab/featured-activity-packs/:activityPackId" />
					<Route path="/tab/:tab" component={LessonPlanner} />
					<Route path="new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/students/edit" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/activities/edit(/:unitName)" component={EditUnitActivitiesContainer}/>
					<Route path="/no_units" component={EmptyAssignedUnits}/>
        </Route>
			</Router>
		);
	}
});
