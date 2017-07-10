import * as React from 'react';
import { connect } from 'react-redux';
import { startListeningToSession, registerPresence } from '../../../actions/classroomSessions';
import CLStudentLobby from './lobby';
import CLStudentStatic from './static.jsx';
import CLStudentSingleAnswer from './singleAnswer.jsx';
import { saveStudentSubmission } from '../../../actions/classroomSessions';
import { getParameterByName } from 'libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList
} from '../interfaces';

class PlayLessonClassroomContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this);
  }

  componentDidMount() {
    const classroom_activity_id = getParameterByName('classroom_activity_id');
    const student = getParameterByName('student');
    if (classroom_activity_id) {
      this.props.dispatch(startListeningToSession(classroom_activity_id));
      if (student) {
        registerPresence(classroom_activity_id, student);
      }
    }
  }

  handleStudentSubmission(data: string, timestamp: string) {
    const classroom_activity_id: string | null = getParameterByName('classroom_activity_id');
    const student: string | null = getParameterByName('student');
    const current_slide: string = this.props.classroomSessions.data.current_slide;
    const submission = {data, timestamp}
    if (classroom_activity_id && student) {
      saveStudentSubmission(
        classroom_activity_id,
        current_slide,
        student,
        submission
      );
    }

  }

  renderCurrentSlide(data: ClassroomLessonSession) {
    const current = data.questions[data.current_slide];
    console.log(current.type);
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLStudentLobby data={data} />
        );
      case 'CL-ST':
        return (
          <CLStudentStatic data={current.data} />
        );
      case 'CL-SA':
        const mode: string | null = data.modes && data.modes[data.current_slide] ? data.modes[data.current_slide] : null;
        const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[data.current_slide] ? data.submissions[data.current_slide] : null;
        const selected_submissions = data.selected_submissions && data.selected_submissions[data.current_slide] ? data.selected_submissions[data.current_slide] : null;
        const props = { mode, submissions, selected_submissions, };
        return (
          <CLStudentSingleAnswer data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
        );
      default:

    }
  }

  public render() {
    const { data, hasreceiveddata }: { data: ClassroomLessonSession, hasreceiveddata: boolean } = this.props.classroomSessions;
    // const data: ClassroomLessonSessions  = this.props.classroomSessions.data;
    // const hasreceiveddata = this.props.classroomSessions.hasreceiveddata
    if (hasreceiveddata) {
      const component = this.renderCurrentSlide(data);
      if (component) {
        return (
          <div className="play-lesson-container">
            <div className="main-content">
              <div className="main-content-wrapper">
                {component}
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <div>
        Loading...
      </div>
    );
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    // classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(PlayLessonClassroomContainer);
