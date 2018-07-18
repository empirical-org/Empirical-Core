import * as React from 'react';
import { connect } from 'react-redux';
const WakeLock: any = require('react-wakelock').default;
import {
  startListeningToSessionForTeacher,
} from '../../../actions/classroomSessions';
import {
  getClassLesson
} from '../../../actions/classroomLesson';
import { getParameterByName } from '../../../libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
} from '../interfaces';
import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons'
import {generate} from '../../../libs/conceptResults/classroomLessons.js';


class MarkingLessonAsCompleted extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
    const activityId: string = this.props.params.lessonID;
    if (classroomUnitId) {
      this.props.dispatch(getClassLesson(activityId));
      this.props.dispatch(startListeningToSessionForTeacher(activityId, classroomUnitId));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.classroomSessions.hasreceiveddata && nextProps.classroomLesson.hasreceiveddata) {
      const data: ClassroomLessonSession = nextProps.classroomSessions.data;
      const lessonData: ClassroomLesson = nextProps.classroomLesson.data;
      this.finishLesson(nextProps)
    }
  }

  finishLesson(nextProps) {
    const questions = nextProps.classroomLesson.data.questions;
    const submissions = nextProps.classroomSessions.data.submissions;
    const activityId = this.props.params.lessonID;
    const classroomUnitId = getParameterByName('classroom_unit_id');
    const conceptResults = generate(questions, submissions);
    const data = new FormData();
    data.append("json", JSON.stringify({
      follow_up: false,
      concept_results: conceptResults,
      activity_id: activityId,
      classroom_unit_id: classroomUnitId,
    }));

    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/finish_lesson`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: data
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      window.location.href = `${process.env.EMPIRICAL_BASE_URL}/teachers/classrooms/activity_planner/lessons`;
    }).catch((error) => {
      console.log('error', error);
    });
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
