import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import LessonPlanner from './LessonPlanner.jsx'
import LessonPlannerContainer from './LessonPlannerContainer.jsx'

export default React.createClass({
  // <Route path="/units/:unit_id/students/edit" component={Index}/>

	render: function() {
		return (
			<Router history={browserHistory}>
        <Route path="/teachers/classrooms/lesson_planner" component={LessonPlannerContainer}>
          <IndexRoute component={LessonPlanner}/>
        </Route>
			</Router>
		);
	}
});
