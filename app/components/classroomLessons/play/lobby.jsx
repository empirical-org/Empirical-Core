import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    if (presence !== undefined) {
      const sortedNames = Object.keys(presence).sort((key1, key2) => {
        const last1 = students[key1].split(" ").slice(-1)[0];
        const last2 = students[key2].split(" ").slice(-1)[0];
        if (last1 < last2) {
          return -1;
        } else if (last1 > last2) {
          return 1;
        } else {
          return 0
        }
      })
      return sortedNames.map((key) => {
        const name = students[key];
        const statusClass = presence[key] ? "online" : "offline";
        return (
          <div>
            <li>
              <p>{name}</p> <div className={statusClass}></div>
            </li>
            <hr />
          </div>
        );
      });
    }
  }

  // Static for now
  renderLessonTitle() {
    return (
      <div className="student-lesson-title-container">
        <p className="student-lesson-title"> 
          Conjunctions of Time 
        </p>
      </div>
    )
  }

  renderLessonInstructions() {
    return (
      <div className="student-instructions-container">
        <p className="student-lesson-instructions-title">
          How to join a lesson?
        </p>

        <ol className="student-lesson-instructions">
          <li>
            <span>Go to <span className="student-highlighted">Quill.org</span> and sign in with </span>
            <br />
            <span className="student-indented">your username and password.</span>
          </li>
          <li>
            <span>Start lesson by clicking on </span>
            <br />
            <span className="student-indented student-highlighted">Start Lesson</span>
          </li>
        </ol>
      </div>
    )
  }

  renderStudentPresence() {
    return (
      <div className="presence-container">
        <div className="presence-header">
          Students Joined:
        </div>
        <div className="presence-list-container">
          <ol>
            {this.renderPresentStudents(this.props.data.presence, this.props.data.students)}
          </ol>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className="student-lobby">
        <div className="student-title-instructions">
          {this.renderLessonTitle()}
          {this.renderLessonInstructions()}
        </div>
        {this.renderStudentPresence()}
      </div>
    );
  }

}

export default Lobby;
