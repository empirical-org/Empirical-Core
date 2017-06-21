import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    if (presence !== undefined) {
      return Object.keys(presence).map((key) => {
        const name = students[key];
        return (
          <li>
            {name}
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
    // if (presence === undefined) {
    //   const numPresent = 0;
    // } else {
    //   const numPresent = Object.keys(presence).length;
    // }
    return (
      <p>
        {Object.keys(presence).length} Student(s) Connected
      </p>
    );
  }

  render() {
    return (
      <div>
        Lobby
        {this.renderNumberPresentStudents(this.props.data.presence)}
        <ul>
          {this.renderPresentStudents(this.props.data.presence, this.props.data.students)}
        </ul>
        {this.renderNextSlideButton()}
      </div>
    );
  }

}

export default Lobby;
