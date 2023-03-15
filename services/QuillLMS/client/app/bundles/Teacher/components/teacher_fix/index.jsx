import React from 'react'

export default class TeacherFixIndex extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
        <p><a href="/teacher_fix/unarchive_units">Restore Deleted Units (fka Unarchive Units)</a> - <span>Use when a teacher has purposefully or accidentally deleted an activity pack and wants it back.</span></p>
        <p><a href="/teacher_fix/recover_classroom_units">Restore Classroom Units</a> - <span>Use this when a teacher has archived and then unarchived a classroom and wants their data back.</span></p>
        <p><a href="/teacher_fix/recover_unit_activities">Restore Unit Activities</a> - <span>Use when a teacher has purposefully or accidentally deleted an activity from an activity pack and wants it back.</span></p>
        <p><a href="/teacher_fix/recover_activity_sessions">Restore Activity Sessions</a> - <span>Use as a first line of defense when teachers complain about missing activity sessions, frequently seen with the diagnostic.</span></p>
        <p><a href="/teacher_fix/merge_student_accounts">Merge Student Accounts</a></p>
        <p><a href="/teacher_fix/merge_teacher_accounts">Merge Teacher Accounts</a></p>
        <p><a href="/teacher_fix/move_student">Move Student from One Class to Another</a></p>
        <p><a href="/teacher_fix/google_unsync">Unsync User with Google Classroom</a></p>
        <p><a href="/teacher_fix/merge_two_schools">Merge Two Schools</a></p>
        <p><a href="/teacher_fix/merge_two_classrooms">Merge Two Classrooms</a></p>
        <p><a href="/teacher_fix/merge_activity_packs">Merge Activity Packs</a></p>
        <p><a href="/teacher_fix/delete_last_activity_session">Delete Last Activity Session</a> - <span>Use when you have completed an activity session on behalf of a student and need to erase the evidence.</span></p>
        <p><a href="/teacher_fix/remove_unsynced_students">Remove All Unsynced Students from Classes</a></p>
        <p><a href="/teacher_fix/recalculate_staggered_release_locks">Recalculate Staggered Release Locks</a></p>
      </div>
    )
  }
}
