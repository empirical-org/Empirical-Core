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
  listenForClassroomLessonsFromFirebase,
  listenForClassroomLessonsReviewsFromFirebase
} from '../../../actions/classroomLesson';

class AdminClassLessonsContainer extends Component<any, any> {
  constructor(props) {
    super(props);

    props.dispatch(listenForClassroomLessonsFromFirebase());
    props.dispatch(listenForClassroomLessonsReviewsFromFirebase())
    props.dispatch(startListeningToEditionMetadata())
  }

  render() {
    return this.props.children
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
    classroomLessonsReviews: props.classroomLessonsReviews,
    customize: props.customize
  };
}

export default connect(select)(AdminClassLessonsContainer);
