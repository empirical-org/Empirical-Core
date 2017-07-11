import React, { Component } from 'react';
import CurrentSlide from './currentSlide.jsx';
import { connect } from 'react-redux';
import { getParameterByName } from 'libs/getParameterByName';
import NextSlideButton from './nextSlideButton.jsx';

class MainContentContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  goToSlide(slide_id: string) {
    // this should be moved to an action
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      this.props.dispatch(updateCurrentSlide(ca_id, slide_id));
    }
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
