import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default React.createClass({

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  },

});
