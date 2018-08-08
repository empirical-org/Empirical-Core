import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'
import UnarchiveUnits from '../components/teacher_fix/unarchive_units.jsx'
import RecoverClassroomUnits from '../components/teacher_fix/recover_classroom_units.jsx'
import RecoverActivitySessions from '../components/teacher_fix/recover_activity_sessions.jsx'
import MergeStudentAccounts from '../components/teacher_fix/merge_student_accounts.jsx'
import MergeTeacherAccounts from '../components/teacher_fix/merge_teacher_accounts.jsx'
import MoveStudent from '../components/teacher_fix/move_student.jsx'
import GoogleUnsync from '../components/teacher_fix/google_unsync'
import MergeTwoSchools from '../components/teacher_fix/merge_two_schools'
import MergeTwoClassrooms from '../components/teacher_fix/merge_two_classrooms'
import DeleteLastActivitySession from '../components/teacher_fix/delete_last_activity_session'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teacher_fix" component={TeacherFixIndex}/>
				<Route path="/teacher_fix/unarchive_units" component={UnarchiveUnits}/>
				<Route path="/teacher_fix/recover_classroom_units" component={RecoverClassroomUnits}/>
				<Route path="/teacher_fix/recover_activity_sessions" component={RecoverActivitySessions}/>
				<Route path="/teacher_fix/merge_student_accounts" component={MergeStudentAccounts}/>
				<Route path="/teacher_fix/merge_teacher_accounts" component={MergeTeacherAccounts}/>
				<Route path="/teacher_fix/move_student" component={MoveStudent}/>
				<Route path="/teacher_fix/google_unsync" component={GoogleUnsync}/>
				<Route path="/teacher_fix/merge_two_schools" component={MergeTwoSchools}/>
				<Route path="/teacher_fix/merge_two_classrooms" component={MergeTwoClassrooms}/>
				<Route path="/teacher_fix/delete_last_activity_session" component={DeleteLastActivitySession}/>
			</Router>
		);
	}
});
