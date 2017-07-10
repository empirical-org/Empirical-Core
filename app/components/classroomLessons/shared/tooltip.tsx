import React, { Component } from 'react';

class Tooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`tooltip ${this.props.className}`}>
        <p className="text">{this.props.text}</p>
        <i className="fa fa-caret-up"/>
      </div>
    );
  }

}

export default Tooltip;
