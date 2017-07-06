import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    return Object.keys(presence).map((key) => {
      const name = students[key];
      return (
        <li key={key}>
          {name}
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        Welcome to this lesson!
        <ul>
          {this.renderPresentStudents(this.props.data.presence, this.props.data.students)}
        </ul>
      </div>
    );
  }

}

export default Lobby;
