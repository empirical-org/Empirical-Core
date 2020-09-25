import * as React from 'react';

import CurrentSlide from './currentSlide';
import NextSlideButton from './nextSlideButton';

interface MainContentContainerProps extends React.Props<any> {
  params: any
}

const MainContentContainer = (props:MainContentContainerProps) =>
  (<div className="main-content">
    <div className="main-content-wrapper">
      <CurrentSlide match={props.match} />
      <div className="next-slide-button-container">
        <NextSlideButton match={props.match} />
      </div>
    </div>
  </div>);

export default MainContentContainer;
