import React from 'react';
import CurrentSlide from './currentSlide';
import NextSlideButton from './nextSlideButton';

const MainContentContainer = (props) =>
  (<div className="main-content">
    <div className="main-content-wrapper">
      <CurrentSlide params={props.params}/>
      <div className="next-slide-button-container">
        <NextSlideButton params={props.params}/>
      </div>
    </div>
  </div>);

export default MainContentContainer;
