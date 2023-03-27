import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import AllUserEditions from './allUserEditions';
import ClassroomLessonsIndex from './index';
import ShowClassroomLesson from './show';
import ShowAdminEdition from './showAdminEdition';
import ShowEditionScriptItem from './showScriptItem';
import ShowEditionSlide from './showSlide';
import ShowClassroomLessonUserEditions from './userEditions';

import {
  listenForClassroomLessonReviews, listenForClassroomLessons
} from '../../../actions/classroomLesson';
import {
  startListeningToEditionMetadata
} from '../../../actions/customize';

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
