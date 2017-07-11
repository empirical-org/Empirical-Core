import React, { Component } from 'react';
import { connect } from 'react-redux';
import CurrentSlide from './currentSlide.jsx';
import { getParameterByName } from 'libs/getParameterByName';
import { goToNextSlide } from '../../../actions/classroomSessions';

class NextSlideButton extends React.Component {
  constructor(props) {
    super(props);
    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  goToNextSlide() {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      const updateInStore = goToNextSlide(ca_id, this.props.classroomSessions.data);
      if (updateInStore) {
        this.props.dispatch(updateInStore);
      }
    }
  }

  render() {
    return (
      <button onClick={this.goToNextSlide}>Next Slide</button>
    );
  }
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
  };
}

export default connect(select)(NextSlideButton);
