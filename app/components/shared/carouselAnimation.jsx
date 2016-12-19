import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default React.createClass({

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  },

});
