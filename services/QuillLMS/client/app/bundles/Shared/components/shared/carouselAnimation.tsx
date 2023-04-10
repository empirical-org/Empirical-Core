import * as React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const CarouselAnimation = ({ children, }) => (
  <ReactCSSTransitionGroup
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    transitionName="carousel"
  >
    {children}
  </ReactCSSTransitionGroup>
)

export { CarouselAnimation };

