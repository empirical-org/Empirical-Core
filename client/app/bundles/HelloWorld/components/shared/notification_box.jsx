import React from 'react';

export default class extends React.Component {

  render() {
    return (
      <div className="notification-box flex-row vertically-centered">
        <p>
          <i className="fa fa-lightbulb-o" aria-hidden="true" />
          {this.props.children}
        </p>
      </div>
    );
  }
}
