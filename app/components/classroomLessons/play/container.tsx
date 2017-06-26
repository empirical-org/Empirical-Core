import * as React from 'react';
import { connect } from 'react-redux';
import { startListeningToSession, registerPresence } from '../../../actions/classroomSessions.js';
import CLStudentLobby from './lobby.jsx';
import CLStudentStatic from './static.jsx';
import CLStudentSingleAnswer from './singleAnswer.jsx';
import { saveStudentSubmission } from '../../../actions/classroomSessions';
import { getParameterByName } from 'libs/getParameterByName';

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

  handleStudentSubmission(submission) {
    const classroom_activity_id: string | null = getParameterByName('classroom_activity_id');
    const student: string | null = getParameterByName('student');
    const action = saveStudentSubmission(
      classroom_activity_id,
      this.props.classroomSessions.data.current_slide,
      student,
      submission
    );
    this.props.dispatch(action);
  }

  renderCurrentSlide(data) {
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
        const mode: string = data.modes && data.modes[data.current_slide] ? data.modes[data.current_slide] : undefined;
        const submissions: string[] = data.submissions && data.submissions[data.current_slide] ? data.submissions[data.current_slide] : undefined;
        const selected_submissions = data.selected_submissions && data.selected_submissions[data.current_slide] ? data.selected_submissions[data.current_slide] : undefined;
        const props = { mode, submissions, selected_submissions, };
        return (
          <CLStudentSingleAnswer data={current.data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
        );
      default:

    }
  }

  public render() {
    const { data, hasreceiveddata, } = this.props.classroomSessions;
    if (hasreceiveddata) {
      const component = this.renderCurrentSlide(data);
      return (
        component
      );
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
