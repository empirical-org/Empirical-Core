import React from 'react'

export default class TeacherFixIndex extends React.Component {
  constructor(props) {
    super(props)
  }

    render() {
      return <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
          <p><a href="/teacher_fix/unarchive_units">Unarchive Units</a> - <span>Use when a teacher has purposefully or accidentally deleted an activity pack and wants it back.</span></p>
          <p><a href="/teacher_fix/recover_classroom_activities">Restore Classroom Activities</a> - <span>Use this when a teacher has archived and then unarchived a classroom and wants their data back.</span></p>
          <p><a href="/teacher_fix/recover_activity_sessions">Restore Activity Sessions</a> - <span>Use as a first line of defense when teachers complain about missing activity sessions, frequently seen with the diagnostic.</span></p>
          <p><a href="/teacher_fix/merge_student_accounts">Merge Student Accounts</a></p>
          <p><a href="/teacher_fix/merge_teacher_accounts">Merge Teacher Accounts</a></p>
          <p><a href="/teacher_fix/move_student">Move Student from One Class to Another</a></p>
          <p><a href="/teacher_fix/google_unsync">Unsync User with Google Classroom</a></p>
      </div>
    }
  }
