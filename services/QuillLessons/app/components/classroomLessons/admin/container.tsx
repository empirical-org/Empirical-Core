import * as React from 'react';
import { connect } from 'react-redux';
import ClassroomLessonsIndex from './index'
import {
  startListeningToEditionMetadata
} from '../../../actions/customize'
import {
  listenForClassroomLessons,
  listenForClassroomLessonReviews
} from '../../../actions/classroomLesson';

class AdminClassLessonsContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const { dispatch, } = this.props

    dispatch(listenForClassroomLessons());
    dispatch(listenForClassroomLessonReviews())
    dispatch(startListeningToEditionMetadata())
  }

  render() {
    return (<ClassroomLessonsIndex />)
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

export default connect(select, dispatch => ({dispatch}), mergeProps)(AdminClassLessonsContainer)
