import * as React from 'react';
import {
  ClassroomLesson, Question
} from '../../../interfaces/classroomLessons';
import {
  ClassroomLessonSession
} from '../interfaces';
import ScriptComponent from '../shared/scriptComponent';
import { sortByLastName } from '../shared/studentSorts';

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
    if (presence !== undefined) {

      const sortedNames = Object.keys(presence).sort((key1, key2) => {
        return sortByLastName(key1, key2, students);
      })

      return sortedNames.map((key) => {
        const name = students[key];
        const statusClass = presence[key] ? "online" : "offline";
        return (
          <li key={name}>
            <p>{name}</p> <div className={statusClass} />
          </li>
        );
      });
    }
  };

  renderNumberPresentStudents(presence) {
    let numPresent;
    if (presence === undefined) {
      numPresent = 0;
    } else {
      numPresent = Object.keys(presence).length;
    }
    return (
      <p>
        <strong>{numPresent} student{numPresent === 1 ? '': 's'}</strong> joined
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
    return (<ScriptComponent script={this.props.slideData.data.teach.script} />)
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
