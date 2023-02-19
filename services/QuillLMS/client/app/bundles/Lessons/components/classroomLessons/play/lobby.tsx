import * as React from 'react';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  Presence,
  Students
} from '../interfaces';
import { sortByLastName } from '../shared/studentSorts'
import { getParameterByName } from '../../../libs/getParameterByName'

const LaptopConnectingToLessonsSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/laptop-connecting-to-lessons.svg`

interface LobbyProps {
  title: string,
  data?: ClassroomLessonSession,
  save?: Function,
  projector?: Boolean
}

class Lobby extends React.Component<LobbyProps, {}> {
  renderStudentBox(studentName, present) {
    const className = present ? "student-box present" : "student-box"
    return (
      <div className={className} key={studentName}>
        <div className="decorative-circle" />
        <p>{studentName}</p>
      </div>
    )
  }

  renderProjectorView() {
    const { data, } = this.props
    const { students, presence, } = data
    if (!students) { return }

    const studentUidsSortedByLastName: Array<string> = Object.keys(students).sort((key1, key2) => {
      return sortByLastName(key1, key2, students);
    })
    const numberOfStudents = Object.keys(students).length
    const numberOfPresentStudents = presence ? Object.keys(presence).length : 0

    const studentList = studentUidsSortedByLastName.map(studentUID => {
      const studentName = students[studentUID]
      const present = presence ? presence[studentUID] : false
      return this.renderStudentBox(studentName, present)
    })
    return (
      <div className="projector-view">
        <div className="projector-header">
          <div className="projector-header-content">
            <h1>Join the lesson</h1>
            <ol>
              <li>Go to quill.org</li>
              <li>Log in</li>
              <li>Select “Join”</li>
            </ol>
          </div>
        </div>
        <div className="projector-body">
          <h2>{numberOfPresentStudents} of {numberOfStudents} students have joined</h2>
          <div className="student-list">
            {studentList}
          </div>
        </div>
      </div>
    )
  }

  renderStudentView() {
    return (
      <div className="full-page-modal-container">
        <div className="full-page-modal">
          <img alt="An illustration of a laptop connected to Quill Lessons" src={LaptopConnectingToLessonsSrc} />
          <h1>You&#39;ve joined the lesson!</h1>
          <h2>Wait for other students to join and for your teacher to begin.</h2>
        </div>
      </div>
    )
  }

  renderStudentOrProjectorLobby() {
    const { projector, } = this.props
    return projector ? this.renderProjectorView() : this.renderStudentView()

  }


  render() {
    return (
      <div className="student-lobby">
        {this.renderStudentOrProjectorLobby()}
      </div>
    )
  }

}

export default Lobby;
