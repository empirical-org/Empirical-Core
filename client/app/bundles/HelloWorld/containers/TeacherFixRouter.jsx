import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'
import UnarchiveUnits from '../components/teacher_fix/unarchive_units.jsx'
import MergeStudentAccounts from '../components/teacher_fix/merge_student_accounts.jsx'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teacher_fix" component={TeacherFixIndex}/>
				<Route path="/teacher_fix/unarchive_units" component={UnarchiveUnits}/>
				<Route path="/teacher_fix/merge_student_accounts" component={MergeStudentAccounts}/>
			</Router>
		);
	}
});
