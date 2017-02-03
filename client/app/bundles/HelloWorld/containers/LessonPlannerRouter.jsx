import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import LessonPlanner from './LessonPlanner.jsx'
import LessonPlannerContainer from './LessonPlannerContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'

export default React.createClass({
	render: function() {
		return (
			<Router>
        <Route path="/" component={LessonPlannerContainer}>
					<IndexRoute component={LessonPlanner}/>
					<Route path="/tab/:tab" component={LessonPlanner}/>
					<Route path="units/:unitId/students/edit" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/activities/edit(/:unitName)" component={EditUnitActivitiesContainer}/>
        </Route>
			</Router>
		);
	}
});
