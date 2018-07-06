import * as React from 'react';
import { connect } from 'react-redux';
const WakeLock: any = require('react-wakelock').default;
import {
  startListeningToSession,
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
} from '../../../interfaces/ClassroomLessons'
import {generate} from '../../../libs/conceptResults/classroomLessons.js';


class MarkingLessonAsCompleted extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    const lesson_id: string = this.props.params.lessonID
    if (ca_id) {
      this.props.dispatch(getClassLesson(lesson_id));
      this.props.dispatch(startListeningToSessionForTeacher(ca_id, lesson_id));
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
    const questions = nextProps.classroomLesson.data.questions
    const submissions = nextProps.classroomSessions.data.submissions
    const caId: string|null = getParameterByName('classroom_activity_id');
    const concept_results = generate(questions, submissions)
    const edition_id: string|undefined = nextProps.classroomSessions.data.edition_id
    const data = new FormData();
    data.append( "json", JSON.stringify( {follow_up: false, concept_results} ) );
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${caId}/finish_lesson`, {
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
      window.location.href = `${process.env.EMPIRICAL_BASE_URL}/teachers/classrooms/activity_planner/lessons`
    }).catch((error) => {
      console.log('error', error)
    })
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
