import React, { Component } from 'react';
import { connect } from 'react-redux';
import rootRef, { firebase } from '../../../libs/firebase';
import _ from 'lodash'
import {
  addLesson
} from '../../../actions/classroomLesson'
import {
  startListeningToEditionMetadata
} from '../../../actions/customize'
import {
  listenForClassroomLessons,
  listenForClassroomLessonsReviewsFromFirebase
} from '../../../actions/classroomLesson';

class AdminClassLessonsContainer extends Component<any, any> {
  constructor(props) {
    super(props);

    this.props.dispatch(listenForClassroomLessons());
    this.props.dispatch(listenForClassroomLessonsReviewsFromFirebase())
    this.props.dispatch(startListeningToEditionMetadata())
  }

  render() {
    return <div>{this.props.children}</div>
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
    classroomLessonsReviews: props.classroomLessonsReviews,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(AdminClassLessonsContainer);
