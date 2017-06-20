import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    return Object.keys(presence).map((key) => {
      const name = students[key];
      return (
        <li>
          {name}
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        Lobby
        <ul>
          {this.renderPresentStudents(this.props.data.presence, this.props.data.students)}
        </ul>
        {/* {this.renderNextSlideButton()} */}
      </div>
    );
  }

}

export default Lobby;
