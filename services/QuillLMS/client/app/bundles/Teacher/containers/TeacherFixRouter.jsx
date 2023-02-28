import React from 'react'
import { BrowserRouter, Route, Switch, } from 'react-router-dom'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'
import UnarchiveUnits from '../components/teacher_fix/unarchive_units.jsx'
import RecoverClassroomUnits from '../components/teacher_fix/recover_classroom_units.jsx'
import RecoverUnitActivities from '../components/teacher_fix/recover_unit_activities.jsx'
import RecoverActivitySessions from '../components/teacher_fix/recover_activity_sessions.jsx'
import MergeStudentAccounts from '../components/teacher_fix/merge_student_accounts.jsx'
import MergeTeacherAccounts from '../components/teacher_fix/merge_teacher_accounts.jsx'
import MergeActivityPacks from '../components/teacher_fix/merge_activity_packs'
import MoveStudent from '../components/teacher_fix/move_student.jsx'
import GoogleUnsync from '../components/teacher_fix/google_unsync'
import MergeTwoSchools from '../components/teacher_fix/merge_two_schools'
import MergeTwoClassrooms from '../components/teacher_fix/merge_two_classrooms'
import DeleteLastActivitySession from '../components/teacher_fix/delete_last_activity_session'
import RemoveUnsyncedStudents from '../components/teacher_fix/remove_unsynced_students'
import RecalculateStaggeredReleaseLocks from '../components/teacher_fix/recalculate_staggered_release_locks'

const TeacherFixRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={UnarchiveUnits} path="/teacher_fix/unarchive_units" />
        <Route component={RecoverClassroomUnits} path="/teacher_fix/recover_classroom_units" />
        <Route component={RecoverUnitActivities} path="/teacher_fix/recover_unit_activities" />
        <Route component={RecoverActivitySessions} path="/teacher_fix/recover_activity_sessions" />
        <Route component={MergeStudentAccounts} path="/teacher_fix/merge_student_accounts" />
        <Route component={MergeTeacherAccounts} path="/teacher_fix/merge_teacher_accounts" />
        <Route component={MoveStudent} path="/teacher_fix/move_student" />
        <Route component={GoogleUnsync} path="/teacher_fix/google_unsync" />
        <Route component={MergeTwoSchools} path="/teacher_fix/merge_two_schools" />
        <Route component={MergeTwoClassrooms} path="/teacher_fix/merge_two_classrooms" />
        <Route component={MergeActivityPacks} path="/teacher_fix/merge_activity_packs" />
        <Route component={DeleteLastActivitySession} path="/teacher_fix/delete_last_activity_session" />
        <Route component={RemoveUnsyncedStudents} path="/teacher_fix/remove_unsynced_students" />
        <Route component={RecalculateStaggeredReleaseLocks} path="/teacher_fix/recalculate_staggered_release_locks" />
        <Route component={TeacherFixIndex} exact path="/teacher_fix" />
      </Switch>
    </BrowserRouter>
  );
};

export default TeacherFixRouter;
