import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default React.createClass({

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  },

});
