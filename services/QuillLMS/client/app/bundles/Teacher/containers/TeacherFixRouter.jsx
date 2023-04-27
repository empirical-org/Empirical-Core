import React from 'react'
import { BrowserRouter, } from 'react-router-dom'
import { CompatRouter, Routes, Route, } from "react-router-dom-v5-compat";

import DeleteLastActivitySession from '../components/teacher_fix/delete_last_activity_session'
import GoogleUnsync from '../components/teacher_fix/google_unsync'
import TeacherFixIndex from '../components/teacher_fix/index.jsx'
import MergeActivityPacks from '../components/teacher_fix/merge_activity_packs'
import MergeStudentAccounts from '../components/teacher_fix/merge_student_accounts.jsx'
import MergeTeacherAccounts from '../components/teacher_fix/merge_teacher_accounts.jsx'
import MergeTwoClassrooms from '../components/teacher_fix/merge_two_classrooms'
import MergeTwoSchools from '../components/teacher_fix/merge_two_schools'
import MoveStudent from '../components/teacher_fix/move_student.jsx'
import RecalculateStaggeredReleaseLocks from '../components/teacher_fix/recalculate_staggered_release_locks'
import RecoverActivitySessions from '../components/teacher_fix/recover_activity_sessions.jsx'
import RecoverClassroomUnits from '../components/teacher_fix/recover_classroom_units.jsx'
import RecoverUnitActivities from '../components/teacher_fix/recover_unit_activities.jsx'
import RemoveUnsyncedStudents from '../components/teacher_fix/remove_unsynced_students'
import UnarchiveUnits from '../components/teacher_fix/unarchive_units.jsx'

const TeacherFixRouter = () => {
  return (
    <BrowserRouter>
      <CompatRouter>
        <Routes>
          <Route element={<UnarchiveUnits />} path="/teacher_fix/unarchive_units" />
          <Route element={<RecoverClassroomUnits />} path="/teacher_fix/recover_classroom_units" />
          <Route element={<RecoverUnitActivities />} path="/teacher_fix/recover_unit_activities" />
          <Route element={<RecoverActivitySessions />} path="/teacher_fix/recover_activity_sessions" />
          <Route element={<MergeStudentAccounts />} path="/teacher_fix/merge_student_accounts" />
          <Route element={<MergeTeacherAccounts />} path="/teacher_fix/merge_teacher_accounts" />
          <Route element={<MoveStudent />} path="/teacher_fix/move_student" />
          <Route element={<GoogleUnsync />} path="/teacher_fix/google_unsync" />
          <Route element={<MergeTwoSchools />} path="/teacher_fix/merge_two_schools" />
          <Route element={<MergeTwoClassrooms />} path="/teacher_fix/merge_two_classrooms" />
          <Route element={<MergeActivityPacks />} path="/teacher_fix/merge_activity_packs" />
          <Route element={<DeleteLastActivitySession />} path="/teacher_fix/delete_last_activity_session" />
          <Route element={<RemoveUnsyncedStudents />} path="/teacher_fix/remove_unsynced_students" />
          <Route element={<RecalculateStaggeredReleaseLocks />} path="/teacher_fix/recalculate_staggered_release_locks" />
          <Route element={<TeacherFixIndex />} exact path="/teacher_fix" />
        </Routes>
      </CompatRouter>
    </BrowserRouter>
  );
};

export default TeacherFixRouter;
