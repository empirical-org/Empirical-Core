import * as React from 'react';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion
} from '../interfaces';
import {
  Question,
  ClassroomLesson
} from '../../../interfaces/classroomLessons';
import ScriptComponent from '../shared/scriptComponent'
import { sortByLastName } from '../shared/studentSorts'

interface LobbyProps {
  data: ClassroomLessonSession,
  slideData: Question,
  lessonData: ClassroomLesson
}

interface LobbyState {}

class Lobby extends React.Component<LobbyProps, LobbyState> {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    // Want to order students by last name alphabetically.
    // Then display if connected or recently disconnected
    if (!!presence) {
      const sortedNames = Object.keys(presence).sort((key1, key2) => {
        return sortByLastName(key1, key2, students);
      })

      return sortedNames.map((key) => {
        const name = students[key];
        const statusClass = presence[key] ? "online" : "offline";
        return (
          <li key={name}>
            <p>{name}</p> <div className={statusClass}></div>
          </li>
        );
      });
    }
  };

  renderNumberPresentStudents(presence) {
    const numPresent = !!presence ?  Object.keys(presence).length : 0
    return (
      <p>
        <strong>{numPresent} student{numPresent === 1 ? '': 's'}</strong> connected.
      </p>
    );
  }

  // This returns static data for now
  renderHeader() {
    return (
      <div className="lobby-header">
        <p className="unit-title">Lessons Pack: {this.props.lessonData.unit}</p>
        <p className="lesson-title">Lesson {this.props.lessonData.lesson}: {this.props.lessonData.topic}</p>
      </div>
    )
  }

  renderScript() {
    return (<ScriptComponent 
      sessionId={this.props.data.id}
      script={this.props.slideData.data.teach.script} 
    />)
  }

  renderPresence() {
    return (
      <div className="presence-container">
        <div className="presence-header">
          {this.renderNumberPresentStudents(this.props.data.presence)}
        </div>
        <div className="presence-list-container">
          <div className="presence-list-titles"><span>Student</span>  <span>Status</span></div>
          <ul>
            {this.renderPresentStudents(this.props.data.presence, this.props.data.students)}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="teacher-lobby">
        {this.renderHeader()}
        <div className="lobby-body">
          {this.renderScript()}
          {this.renderPresence()}
        </div>
      </div>
    );
  }

}

export default Lobby;
