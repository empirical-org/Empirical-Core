import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter, Link } from 'react-router-dom';

import ClassroomLessonsIndex from './index'
import AllUserEditions from './allUserEditions';
import ShowClassroomLesson from './show';
import ShowAdminEdition from './showAdminEdition';
import ShowEditionSlide from './showSlide';
import ShowEditionScriptItem from './showScriptItem';
import ShowClassroomLessonUserEditions from './userEditions';

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
    return (
      <Switch>
        <Route component={ShowEditionScriptItem} path='/admin/classroom-lessons/:classroomLessonID/editions/:editionID/slide/:slideID/scriptItem/:scriptItemID' />
        <Route component={ShowEditionSlide} path='/admin/classroom-lessons/:classroomLessonID/editions/:editionID/slide/:slideID' />
        <Route component={ShowAdminEdition} path='/admin/classroom-lessons/:classroomLessonID/editions/:editionID' />
        <Route component={ShowClassroomLessonUserEditions} path='/admin/classroom-lessons/:classroomLessonID/editions' />
        <Route component={AllUserEditions} path='/admin/classroom-lessons/editions' />
        <Route component={ShowClassroomLesson} path='/admin/classroom-lessons/:classroomLessonID' />
        <Route component={ClassroomLessonsIndex} path='/admin/classroom-lessons' />
      </Switch>
    )
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

export default withRouter(connect(select, dispatch => ({dispatch}), mergeProps)(AdminClassLessonsContainer))
