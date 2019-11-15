import React from 'react';

export default class extends React.Component {

  render() {
    return (
      <div className="notification-box flex-row vertically-centered">
        <p>
          <i aria-hidden="true" className="fas fa-lightbulb-o" />
          {this.props.children}
        </p>
      </div>
    );
  }
}
