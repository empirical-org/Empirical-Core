import React from 'react'

export default class TeacherFixIndex extends React.Component {
  constructor(props) {
    super(props)
  }

    render() {
      return <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
          <p><a href="/teacher_fix/unarchive_units">Unarchive Units</a></p>
          <p><a href="/teacher_fix/recover_classroom_activities">Restore Classroom Activities</a></p>
          <p><a href="/teacher_fix/merge_student_accounts">Merge Student Accounts</a></p>
          <p><a href="/teacher_fix/move_student">Move Student from One Class to Another</a></p>
      </div>
    }
  }
