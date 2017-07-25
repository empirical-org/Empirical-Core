import React from 'react';
import CurrentSlide from './currentSlide';
import NextSlideButton from './nextSlideButton';

const MainContentContainer = () =>
  (<div className="main-content">
    <div className="main-content-wrapper">
      <CurrentSlide />
      <div className="next-slide-button-container">
        <NextSlideButton />
      </div>
    </div>
  </div>);

export default MainContentContainer;
