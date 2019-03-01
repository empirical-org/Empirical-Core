import React from 'react';
import { connect } from 'react-redux';
import Sidebar from './sidebar';
import MainContentContainer from './mainContentContainer';
import {
  startListeningToSessionForTeacher,
} from '../../../actions/classroomSessions';
import { getParameterByName } from '../../../libs/getParameterByName';

import { getSubOptimalResponses } from '../../../libs/sharedResponseFunctions';
class TeachContainer extends React.Component {
  constructor(props) {
    super(props);
    const classroomUnitId = getParameterByName('classroom_unit_id')
    const activityUid = props.params.lessonID
    const classroomSessionId = classroomUnitId ? classroomUnitId.concat(activityUid) : null
    props.dispatch(startListeningToSessionForTeacher(activityUid, classroomUnitId, classroomSessionId));
  }

  render(){
    const {params, session, lesson, edition} = this.props;
    const teachLessonContainerStyle = session.preview
    ? {'height': 'calc(100vh - 113px)'}
    : {'height': 'calc(100vh - 60px)'}
    return (
      <div className="teach-lesson-container" style={teachLessonContainerStyle}>
        {/* <p>Current Slide {session.current_slide}</p>
        <p>Edition Name: {edition.name}</p>
        <p>Lesson Title: {lesson.title}</p> */}
        <Sidebar params={params} session={session} edition={edition} lesson={lesson}></Sidebar>
        <MainContentContainer params={params} session={session} edition={edition} lesson={lesson}/>
      </div>
    )
  }
}

function select(props) {
  return {
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(TeachContainer);