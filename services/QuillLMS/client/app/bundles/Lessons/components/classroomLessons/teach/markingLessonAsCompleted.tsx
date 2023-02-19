import * as React from 'react';
import { connect } from 'react-redux';

import {
  startListeningToSessionForTeacher,
  finishActivity,
} from '../../../actions/classroomSessions';
import {
  getClassLesson
} from '../../../actions/classroomLesson';
import {
  getEditionQuestions,
} from '../../../actions/customize'
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  ClassroomLessonSession,
  ClassroomUnitId,
  ClassroomSessionId
} from '../interfaces';
import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons'
import {generate} from '../../../libs/conceptResults/classroomLessons.js';

interface MarkingLessonsAsCompletedState {
  classroomUnitId: ClassroomUnitId|null,
  classroomSessionId: ClassroomSessionId|null
}

class MarkingLessonAsCompleted extends React.Component<any, MarkingLessonsAsCompletedState> {
  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID
    this.state = {
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }
  }

  componentDidMount() {
    const { dispatch, match, } = this.props
    const { classroomUnitId, classroomSessionId } = this.state
    const activityId: string = match.params.lessonID;
    if (classroomUnitId && classroomSessionId) {
      dispatch(startListeningToSessionForTeacher(activityId, classroomUnitId, classroomSessionId));
    }
  }

  componentDidUpdate(prevProps) {
    const { classroomSessions, customize, dispatch, } = this.props

    if (classroomSessions.hasreceiveddata && classroomSessions.data.edition_id) {
      dispatch(getEditionQuestions(classroomSessions.data.edition_id))
    }

    if (classroomSessions.hasreceiveddata && Object.keys(customize.editionQuestions).length) {
      this.finishLesson(this.props)
    }

  }

  finishLesson(nextProps) {
    const { match, } = this.props
    const { classroomUnitId, } = this.state
    const { questions, } = nextProps.customize.editionQuestions;
    const { submissions, } = nextProps.classroomSessions.data;
    const activityId = match.params.lessonID;
    const conceptResults = generate(questions, submissions);

    if (classroomUnitId) {
      finishActivity(false, conceptResults, null, activityId, classroomUnitId,
        (response) => {
          window.location.href = `${import.meta.env.DEFAULT_URL}/teachers/classrooms/activity_planner/lessons`;
        }
      );
    }
  }

  render() {
    return (
      <div className="marking-lesson-as-completed">
          This lesson is getting marked as completed
      </div>
    );
  }
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(MarkingLessonAsCompleted);
