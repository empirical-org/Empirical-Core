import React from 'react'

import { requestGet, requestPost, } from '../../../../modules/request/index'

export default class RemoveUnsyncedStudents extends React.Component {
  state = {
    teacherIdentifier: '',
    unsyncedStudentsByClassroom: null,
    error: null
  }

  handleUnsyncedStudentsByClassroomListing = () => {
    const { teacherIdentifier } = this.state

    requestGet(
      `${import.meta.env.DEFAULT_URL}/teacher_fix/list_unsynced_students_by_classroom?teacher_identifier=${teacherIdentifier}`,
      (body) => {
        if (body.unsynced_students_by_classroom) {
          this.setState({error: null, unsyncedStudentsByClassroom: body.unsynced_students_by_classroom})
        }
      },
      (body) => {
        if (body.error) {
          this.setState({error: body.error})
        }
      }
    )
  }

  handleUnsyncedStudentsRemoval = () => {
    const { teacherIdentifier } = this.state

    requestPost(
      `${import.meta.env.DEFAULT_URL}/teacher_fix/remove_unsynced_students`,
      { teacher_identifier: teacherIdentifier, },
      (body) => {
        this.setState({ teacherIdentifier: '', unsyncedStudentsByClassroom: null, error: null})
        window.alert('All unsynced students have been removed from their classrooms')
      }
    )
  }

  handleTeacherIdentifierUpdate = (e) => {
    this.setState({teacherIdentifier: e.target.value})
  };

  renderTeacherIdentifierForm() {
    const { teacherIdentifier } = this.state

    return (
      <div className="input-row">
        <label>
          Teacher Email Or Username:
          <input
            aria-label="Teacher Email Or Username"
            onChange={this.handleTeacherIdentifierUpdate}
            type="text"
            value={teacherIdentifier}
          />
        </label>
        <button onClick={this.handleUnsyncedStudentsByClassroomListing} type="button" >View Unsynced Students</button>
      </div>
    )
  }

  renderError() {
    const { error } = this.state

    if(error) {
      return <p className="error">{error}</p>
    }
  }

  renderInstructions() {
    return (
      <React.Fragment>
        <p>
          This allows you to remove all students from Quill classes that were previously synced from Google Classroom
          or Clever, but are no longer synced because they were removed from the class in Google Classroom or Clever.
          To identify students in this state, go to a class synced from Google Classroom or Clever and look for
          &quot;No&quot; in the &quot;Synced&quot; column.
        </p>
        <p>
          If there are only a few students that need to be removed it is probably easier to use the &quot;Remove from
          class&quot; action, which is available in the teacher dashboard, rather than this teacher fix.
        </p>
        <p>
          Please exercise caution when using this teacher fix, as removing a student from a class also removes their
          progress. Some teachers like to retain student progress in one class so they have the option of moving that
          student (and their progress) to another class in the future.
        </p>
        <p>
          Clicking &quot;View unsynced students&quot; below will show you a list of all unsynced students by class. It
          only includes classes that the teacher owns (i.e. it does not include classes that the teacher co-teaches).
        </p>
      </React.Fragment>
    )
  }

  renderUnsyncedStudentsByClassroom() {
    const { unsyncedStudentsByClassroom } = this.state
    if (unsyncedStudentsByClassroom === null) return null;

    if (unsyncedStudentsByClassroom.length > 0) {
      const unsyncedStudentsByClassroomList = unsyncedStudentsByClassroom.map(classroom => {
        return (
          <div key={classroom.id}>
            <span>{classroom.name} ({classroom.code})</span>
            {classroom.unsynced_students.map(student => {
              return (
                <div key={student.id}>
                  <span>{student.name} ({student.email})</span>
                </div>
              )
            })}
            <br />
          </div>
        )
      })

      return (
        <div>
          {unsyncedStudentsByClassroomList}
          <button onClick={this.handleUnsyncedStudentsRemoval} type="button">Remove Unsynced Students</button>
        </div>
      )
    } else {
      return (
        <div>
          <span>No unsynced students were found.</span>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
        <h2>Remove All Unsynced Students from Classes</h2>
        {this.renderInstructions()}
        {this.renderTeacherIdentifierForm()}
        {this.renderError()}
        {this.renderUnsyncedStudentsByClassroom()}
      </div>
    )
  }
}
