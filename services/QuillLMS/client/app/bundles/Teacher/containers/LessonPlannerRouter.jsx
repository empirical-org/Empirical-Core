import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LessonPlannerContainer from './LessonPlannerContainer.jsx'

export default class LessonPlannerRouter extends React.Component{
	constructor(props) {
		super(props)

		this.redirectToAssignActivities()
	}

	redirectToAssignActivities() {
		const locationArray = window.location.href.split('/activity_planner/')
		const pathEnd = locationArray[1] === 'assign-new-activity' ? '' : locationArray[1]
		if (
			!(pathEnd === undefined ||
			pathEnd === 'no_units' ||
			pathEnd.slice(0, 7) === 'lessons' ||
			pathEnd.slice(0, 5) === 'units' ||
			pathEnd.slice(0, 8) === 'new_unit')
		) {
			window.location = locationArray[0] + '/assign/' + pathEnd
		}
	}

	render() {
		return (
		  <Router>
		    <Route component={LessonPlannerContainer} path="/teachers/classrooms/activity_planner" />
		  </Router>
		);
	}
};
