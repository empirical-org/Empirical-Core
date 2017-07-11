import React, { Component } from 'react';
import CurrentSlide from './currentSlide.jsx';
import { getParameterByName } from 'libs/getParameterByName';

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

  goToNextSlide() {
    // this should also prob be moved to action
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      const updateInStore = goToNextSlide(ca_id, this.props.classroomSessions.data);
      if (updateInStore) {
        this.props.dispatch(updateInStore);
      }
    }
  }

  renderNextSlideButton() {
    return (
      <div className="next-slide-button-container">
        <button onClick={this.goToNextSlide}>Next Slide</button>
      </div>
    );
  }

  render() {
    return (
      <div className="main-content">
        <div className="main-content-wrapper">
          <CurrentSlide />
        </div>
      </div>
    );
  }

}

export default MainContentContainer;
