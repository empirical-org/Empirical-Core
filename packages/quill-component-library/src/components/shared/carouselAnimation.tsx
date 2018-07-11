import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const CarouselAnimation = (props) => (
  <ReactCSSTransitionGroup
    transitionName="carousel"
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
  >
    {props.children}
  </ReactCSSTransitionGroup>
)

export { CarouselAnimation }
