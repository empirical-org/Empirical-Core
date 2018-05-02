import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import StudentProfile from './StudentProfileAppClient'
import JoinClass from './JoinClassAppClient'
import AccountSettings from './AccountSettingsAppClient'

export default class StudentProfileRouter extends React.Component {
  render() {
    return (
      <Router Router history={browserHistory}>
        {/* <Route path="/teacher_fix" component={TeacherFixIndex}/>
        <Route path="/teacher_fix/unarchive_units" component={UnarchiveUnits}/>
        <Route path="/teacher_fix/recover_classroom_activities" component={RecoverClassroomActivities}/>
        <Route path="/teacher_fix/recover_activity_sessions" component={RecoverActivitySessions}/>
        <Route path="/teacher_fix/merge_student_accounts" component={MergeStudentAccounts}/>
        <Route path="/teacher_fix/merge_teacher_accounts" component={MergeTeacherAccounts}/>
        <Route path="/teacher_fix/move_student" component={MoveStudent}/>
        <Route path="/teacher_fix/google_unsync" component={GoogleUnsync}/>
        <Route path="/teacher_fix/merge_two_schools" component={MergeTwoSchools}/>
        <Route path="/teacher_fix/merge_two_classrooms" component={MergeTwoClassrooms}/>
        <Route path="/teacher_fix/delete_last_activity_session" component={DeleteLastActivitySession}/> */}
      </Router>
    );
    
  }
	}
