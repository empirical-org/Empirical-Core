import * as React from 'react';
import CurrentSlide from './currentSlide';
import NextSlideButton from './nextSlideButton';

interface MainContentContainerProps extends React.Props<any> {
  params: any
}

const MainContentContainer = (props:MainContentContainerProps) =>
  (<div className="main-content">
    <div className="main-content-wrapper">
      <CurrentSlide params={props.params}/>
      <div className="next-slide-button-container">
        <NextSlideButton params={props.params}/>
      </div>
    </div>
  </div>);

export default MainContentContainer;
