import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'
import UnarchiveUnits from '../components/teacher_fix/unarchive_units.jsx'
import RecoverClassroomActivities from '../components/teacher_fix/recover_classroom_activities.jsx'
import MergeStudentAccounts from '../components/teacher_fix/merge_student_accounts.jsx'
import MergeTeacherAccounts from '../components/teacher_fix/merge_teacher_accounts.jsx'
import MoveStudent from '../components/teacher_fix/move_student.jsx'
import GoogleUnsync from '../components/teacher_fix/google_unsync'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teacher_fix" component={TeacherFixIndex}/>
				<Route path="/teacher_fix/unarchive_units" component={UnarchiveUnits}/>
				<Route path="/teacher_fix/recover_classroom_activities" component={RecoverClassroomActivities}/>
				<Route path="/teacher_fix/merge_student_accounts" component={MergeStudentAccounts}/>
				<Route path="/teacher_fix/merge_teacher_accounts" component={MergeTeacherAccounts}/>
				<Route path="/teacher_fix/move_student" component={MoveStudent}/>
				<Route path="/teacher_fix/google_unsync" component={GoogleUnsync}/>
			</Router>
		);
	}
});
