import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getParameterByName } from '../../../libs/getParameterByName';
import { goToNextSlide } from '../../../actions/classroomSessions';
import {
  ClassroomLessonSession,
} from '../interfaces'
import {
  EditionQuestions
} from '../../../interfaces/customize'

class NextSlideButton extends Component<any, any> {
  constructor(props) {
    super(props);
    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  goToNextSlide() {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    const sessionData: ClassroomLessonSession = this.props.classroomSessions.data;
    const editionData: EditionQuestions = this.props.customize.editionQuestions;
    if (ca_id) {
      const updateInStore = goToNextSlide(ca_id, sessionData, editionData);
      if (updateInStore) {
        this.props.dispatch(updateInStore);
      }
    }
  }

  render() {
    const data = this.props.classroomSessions.data;
    const editionData = this.props.customize.editionQuestions
    if (editionData.questions && Number(data.current_slide) === editionData.questions.length - 1) {
      return <span />;
    } else if (Number(data.current_slide) === 0) {
      return <span>Press the <span>right arrow key</span> to continue to the next slide.<button onClick={this.goToNextSlide}>Next Slide</button></span>
    }
    return (
      <button onClick={this.goToNextSlide}>Next Slide</button>
    );
  }
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    customize: props.customize,
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(NextSlideButton);
