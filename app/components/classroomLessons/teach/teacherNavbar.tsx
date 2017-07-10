import React, { Component } from 'react';
const watchTeacherIcon = require('../../../img/watch_teacher_icon.svg')
const exitIcon = require('../../../img/exit_icon.svg')
const projectorIcon = require('../../../img/projector_icon.svg')
const helpIcon = require('../../../img/help_icon.svg')

class TeacherNavbar extends Component {
  constructor(props) {
    super(props);
  }

  presentStudentCount() {
    const presence = this.props.data.presence
    const numPresent = presence === undefined ? 0 : Object.keys(presence).filter((id) => presence[id] === true ).length
    const circleClassname = numPresent === 0 ? 'offline' : 'online'
    return <p className="present-student-count"><div className={circleClassname}/> {numPresent} Student{numPresent === 1 ? '': 's'} Online</p>
    );
  }

  render() {
    return (
      <div className="lessons-teacher-navbar">
        <p className="lesson-title"><span>Lesson 1:</span> Conjunctions of Time</p>
        <span className="toolbar">
          {this.presentStudentCount()}
          <img src={projectorIcon}/>
          <img src={watchTeacherIcon}/>
          <img src={exitIcon}/>
          <img className="help-icon" src={helpIcon}/>
        </span>
      </div>
    );
  }

}

export default TeacherNavbar;
