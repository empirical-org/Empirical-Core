import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'
import UnarchiveUnits from '../components/teacher_fix/unarchive_units.jsx'
import RecoverClassroomUnits from '../components/teacher_fix/recover_classroom_units.jsx'
import RecoverUnitActivities from '../components/teacher_fix/recover_unit_activities.jsx'
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
  <Router history={browserHistory} Router>
    <Route component={TeacherFixIndex} path="/teacher_fix"/>
    <Route component={UnarchiveUnits} path="/teacher_fix/unarchive_units"/>
    <Route component={RecoverClassroomUnits} path="/teacher_fix/recover_classroom_units"/>
    <Route component={RecoverUnitActivities} path="/teacher_fix/recover_unit_activities"/>
    <Route component={RecoverActivitySessions} path="/teacher_fix/recover_activity_sessions"/>
    <Route component={MergeStudentAccounts} path="/teacher_fix/merge_student_accounts"/>
    <Route component={MergeTeacherAccounts} path="/teacher_fix/merge_teacher_accounts"/>
    <Route component={MoveStudent} path="/teacher_fix/move_student"/>
    <Route component={GoogleUnsync} path="/teacher_fix/google_unsync"/>
    <Route component={MergeTwoSchools} path="/teacher_fix/merge_two_schools"/>
    <Route component={MergeTwoClassrooms} path="/teacher_fix/merge_two_classrooms"/>
    <Route component={DeleteLastActivitySession} path="/teacher_fix/delete_last_activity_session"/>
  </Router>
		);
	}
});
