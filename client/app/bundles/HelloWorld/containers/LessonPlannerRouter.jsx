import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import LessonPlanner from './LessonPlanner.jsx'
import LessonPlannerContainer from './LessonPlannerContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import EmptyAssignedUnits from '../components/lesson_planner/manage_units/EmptyAssignedUnits.jsx'

export default React.createClass({
	render: function() {
		return (
			<Router>
        <Route path="/" component={LessonPlannerContainer}>
					<IndexRoute component={LessonPlanner}/>
					<Route path="/tab/:tab" component={LessonPlanner}/>
					<Route path="new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/students/edit" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/activities/edit(/:unitName)" component={EditUnitActivitiesContainer}/>
					<Route path="/no_units" component={EmptyAssignedUnits}/>
        </Route>
			</Router>
		);
	}
});
