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

interface LobbyProps {
  title: string,
  data?: ClassroomLessonSession,
  save?: Function,
  projector?: Boolean
}

interface LobbyState {

}

class Lobby extends React.Component<LobbyProps, LobbyState> {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence: Presence, students: Students) {
    if (presence !== undefined) {
      const sortedNames: Array<string> = Object.keys(presence).sort((key1, key2) => {
        return sortByLastName(key1, key2, students);
      })
      return sortedNames.map((key, i) => {
        const number: number = i + 1
        const name: string = students[key];
        const className = key === getParameterByName('student') ? 'bold-name' : ''
        const statusClass: string = presence[key] ? "online" : "offline";
        return (
          <div className="student-row" key={key}>
            <p><span className='student-number'>{number}</span><span className={className}>{name}</span></p>
            <div className={statusClass}></div>
          </div>
        );
      });
    }
  }

  // Static for now
  renderLessonTitle() {
    const title = this.props.title
    return (
      <div className="student-lesson-title-container">
        <p className="student-lesson-title">
          {title}
        </p>
      </div>
    )
  };

  renderLessonInstructions() {
    return (
      <div className="student-instructions-container">
        <p className="student-lesson-instructions-title">
          How to join a lesson:
        </p>

        <div className="student-lesson-instructions">
            <div className="student-lesson-instruction">
              <span className="instruction-number">1</span>
              <span className="instruction-text"> Go to <span className="student-highlighted">Quill.org</span> and sign in with your username and password</span>
            </div>
            <div className="student-lesson-instruction">
              <span className="instruction-number">2</span>
              <span className="instruction-text">Join the lesson by clicking on <span className="student-highlighted">Join Lesson</span></span>
            </div>
            <div className="student-lesson-instruction">
              <span className="instruction-number">3</span>
              <span className="instruction-text">Find your name on the list to the right once you are in the lesson</span>
            </div>
        </div>
      </div>
    )
  }

  renderStudentPresence() {
    const presentStudents = this.props.data ? this.renderPresentStudents(this.props.data.presence, this.props.data.students) : <span/>
    const className = this.props.projector ? 'presence-container projector-presence' : 'presence-container'
    return (
      <div className={className}>
        <div className="presence-header">
          Students Joined:
        </div>
        <div className="presence-list-container">
          {presentStudents}
        </div>
      </div>
    )
  }

  renderStudentView() {
    return <div className="student-view">
      <div className="joined-message">
        <p>You've joined this lesson:</p>
        <h1>{this.props.title}</h1>
        <p>Your name should appear in the "Students Joined" list.</p>
      </div>
      <div className="next-step">
        <h2>Next Step:</h2>
        <p>Hold tight and wait for your teacher to begin the lesson.</p>
      </div>
    </div>

  }

  renderStudentOrProjectorLobby() {
    if (this.props.projector) {
      return (
        <div className="projector-view">
        {this.renderLessonTitle()}
        {this.renderLessonInstructions()}
        </div>
      );
    } else {
      return this.renderStudentView()
    }
  }


  render() {
    return <div className="student-lobby">
      {this.renderStudentOrProjectorLobby()}
      {this.renderStudentPresence()}
    </div>
  }

}

export default Lobby;
