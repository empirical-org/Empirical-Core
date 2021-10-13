import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class RemoveUnsyncedStudents extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      teacherIdentifier: '',
      unsyncedStudentsByClassroom: null,
      error: null
    }

    this.listUnsyncedStudentsByClassroom = this.listUnsyncedStudentsByClassroom.bind(this)
    this.removeUnsyncedStudents = this.removeUnsyncedStudents.bind(this)
  }

  listUnsyncedStudentsByClassroom() {
    request.get({
      url: `${process.env.DEFAULT_URL}/teacher_fix/list_unsynced_students_by_classroom`,
      qs: {teacher_identifier: this.state.teacherIdentifier }
    },
    (_error, _response, body) => {
      const parsedResponse = JSON.parse(body)

      if (parsedResponse.error) {
        this.setState({error: parsedResponse.error})
      } else if (parsedResponse.unsynced_students_by_classroom) {
        this.setState({error: null, unsyncedStudentsByClassroom: parsedResponse.unsynced_students_by_classroom})
      }
    });
  }

  removeUnsyncedStudents() {
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/remove_unsynced_students`,
      json: {teacher_identifier: this.state.teacherIdentifier, authenticity_token: getAuthToken()}
    },
    (_error, response, _body) => {
      if (response.statusCode === 200) {
        this.setState({ teacherIdentifier: '', unsyncedStudentsByClassroom: null, error: null})
        window.alert('All unsynced students have been removed from their classrooms')
      }
    })
  }

  updateTeacherIdentifier = (e) => {
    this.setState({teacherIdentifier: e.target.value})
  };

  renderTeacherIdentifierForm() {
    return (
      <div className="input-row">
        <label>Teacher Email Or Username:</label>
        <input onChange={this.updateTeacherIdentifier} type="text" value={this.state.teacherIdentifier} />
        <button onClick={this.listUnsyncedStudentsByClassroom}>List Students</button>
      </div>
    )
  }

  renderError() {
    if(this.state.error) {
      return <p className="error">{this.state.error}</p>
    }
  }

  renderInstructions() {
    return (
      <React.Fragment>
        <p>
          This allows you to remove all students from Quill classes that were previously synced from Google Classroom
          or Clever, but are no longer synced because they were removed from the class in Google Classroom or Clever.
          To identify students in this state, go to a class synced from Google Classroom or Clever and look for "No"
          in the "Synced" column.
        </p>
        <p>
          If there are only a few students that need to be removed it is probably easier to use the "Remove from class"
          action, which is available in the teacher dashboard, rather than this teacher fix.
        </p>
        <p>
          Please exercise caution when using this teacher fix, as removing a student from a class also removes their
          progress. Some teachers like to retain student progress in one class so they have the option of moving that
          student (and their progress) to another class in the future.
        </p>
      </React.Fragment>
    )
  }

  renderUnsyncedStudentsByClassroom() {
    if (this.state.unsyncedStudentsByClassroom === null) return null;

    if (this.state.unsyncedStudentsByClassroom.length > 0) {
      const unsyncedStudentsByClassroomList = this.state.unsyncedStudentsByClassroom.map(classroom => {
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
          <button onClick={this.removeUnsyncedStudents}>Remove Unsynced Students</button>
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
