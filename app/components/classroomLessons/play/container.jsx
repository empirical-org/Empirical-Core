import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startListeningToSession, registerPresence } from '../../../actions/classroomSessions.js';
import CLStudentLobby from './lobby.jsx';
import CLStudentStatic from './static.jsx';
import CLStudentSingleAnswer from './singleAnswer.jsx';
import { saveStudentSubmission } from '../../../actions/classroomSessions';

class PlayLessonClassroomContainer extends Component {
  constructor(props) {
    super(props);
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this);
  }

  componentDidMount() {
    const { classroom_activity_id, student, } = this.props.location.query;
    this.props.dispatch(startListeningToSession(classroom_activity_id));
    registerPresence(classroom_activity_id, student);
  }

  handleStudentSubmission(submission) {
    const { classroom_activity_id, student, } = this.props.location.query;
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
        return (
          <CLStudentSingleAnswer data={current.data} handleStudentSubmission={this.handleStudentSubmission} />
        );
      default:

    }
  }

  render() {
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
