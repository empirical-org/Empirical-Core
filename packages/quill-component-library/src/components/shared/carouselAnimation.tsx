import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace'

const CarouselAnimation = ({ children, }) => (
  <ReactCSSTransitionReplace
    transitionAppear={true}
    transitionAppearTimeout={400}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    transitionName="carousel"
  >
    {children}
  </ReactCSSTransitionReplace>
)

export { CarouselAnimation }
