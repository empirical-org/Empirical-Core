import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  renderPresentStudents(presence, students) {
    // const ids = presence.keys();

    for (const id in presence) {
      console.log(id);
    }
    const names = [];
    for (const key in presence) {
      names.push(students[key]);
    }

    return (
      <ul>
        {names.map(name => (
          <li>
            {name}
          </li>
          ))}
      </ul>
    );
  }

  render() {
    return (
      <div>
        Lobby
        {this.renderPresentStudents(this.props.data.presence, this.props.data.students)}
      </div>
    );
  }

}

export default Lobby;
