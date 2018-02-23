import React from 'react'
import createReactClass from 'create-react-class';

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
