import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teacher_fix" component={TeacherFixIndex}>
					<IndexRoute component={TeacherFixIndex}/>
					<Route path="unarchive_units" component={TeacherFixIndex}/>
        </Route>
			</Router>
		);
	}
});
