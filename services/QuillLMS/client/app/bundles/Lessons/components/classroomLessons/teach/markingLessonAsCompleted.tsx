import * as React from 'react';
import { connect } from 'react-redux';
import WakeLock from 'react-wakelock-react16'
import {
  startListeningToSessionForTeacher,
  finishActivity,
} from '../../../actions/classroomSessions';
import {
  getClassLesson
} from '../../../actions/classroomLesson';
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  ClassroomLessonSessions,
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
    const { classroomUnitId, classroomSessionId } = this.state
    const activityId: string = this.props.match.params.lessonID;
    if (classroomUnitId && classroomSessionId) {
      this.props.dispatch(getClassLesson(activityId));
      this.props.dispatch(startListeningToSessionForTeacher(activityId, classroomUnitId, classroomSessionId));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.classroomSessions.hasreceiveddata && nextProps.classroomLesson.hasreceiveddata) {
      const data: ClassroomLessonSession = nextProps.classroomSessions.data;
      const lessonData: ClassroomLesson = nextProps.classroomLesson.data;
      this.finishLesson(nextProps)
    }
  }

  finishLesson(nextProps) {
    const questions = nextProps.classroomLesson.data.questions;
    const submissions = nextProps.classroomSessions.data.submissions;
    const activityId = this.props.match.params.lessonID;
    const classroomUnitId:ClassroomUnitId|null = this.state.classroomUnitId;
    const conceptResults = generate(questions, submissions);

    if (classroomUnitId) {
      finishActivity(false, conceptResults, null, activityId, classroomUnitId,
        (response) => {
          window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms/activity_planner/lessons`;
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
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(MarkingLessonAsCompleted);
