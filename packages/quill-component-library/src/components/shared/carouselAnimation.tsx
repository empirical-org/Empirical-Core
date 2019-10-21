import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const CarouselAnimation = (props) => (
  <ReactCSSTransitionGroup
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    transitionName="carousel"
  >
    {props.children}
  </ReactCSSTransitionGroup>
)

export { CarouselAnimation }
