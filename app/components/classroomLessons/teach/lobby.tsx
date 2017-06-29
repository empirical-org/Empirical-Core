import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    // Want to order students by last name alphabetically.
    // Then display if connected or recently disconnected
    if (presence !== undefined) {
      return Object.keys(presence).map((key) => {
        const name = students[key];
        const statusClass = "online"; // Tina Look Here! return offline if student has disconnected
        return (
          <li>
            <p>{name}</p> <div className={statusClass}></div>
          </li>
        );
      });
    } else {

    }
  }

  renderNextSlideButton() {
    return (
      <button onClick={this.props.goToNextSlide} >Next Slide</button>
    );
  }

  renderNumberPresentStudents(presence) {
    let numPresent;
    if (presence === undefined) {
      numPresent = 0;
    } else {
      numPresent = Object.keys(presence).length;
    }
    return (
      <p>
        <strong>{numPresent} student{numPresent === 1 ? '': 's'}</strong> joined this lesson.
      </p>
    );
  }

  // This returns static data for now
  renderHeader() {
    return (
      <div className="lobby-header">
        <p className="unit-title">Unit: Complex Sencences</p>
        <p className="lesson-title">Lesson 1: Conjunctions of Time</p>
      </div>
    )
  }

  renderScript() {
    return (
      <div className="lobby-text" dangerouslySetInnerHTML={{__html: this.props.slideData.data}} >
      </div>
    )
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

        {this.renderNextSlideButton()}
      </div>
    );
  }

}

export default Lobby;
