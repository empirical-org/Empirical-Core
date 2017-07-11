import React, { Component } from 'react';
import CurrentSlide from './currentSlide.jsx';
import { connect } from 'react-redux';
import { getParameterByName } from 'libs/getParameterByName';
import NextSlideButton from './nextSlideButton.jsx';

class MainContentContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-content">
        <div className="main-content-wrapper">
          <CurrentSlide />
          <div className="next-slide-button-container">
            <NextSlideButton />
          </div>
        </div>
      </div>
    );
  }

}

export default MainContentContainer;
