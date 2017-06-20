import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startListeningToSession, registerPresence } from '../../../actions/classroomSessions.js';
import CLStudentLobby from './lobby.jsx';

class PlayLessonClassroomContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { classroom_activity_id, student, } = this.props.location.query;
    this.props.dispatch(startListeningToSession(classroom_activity_id));
    registerPresence(classroom_activity_id, student);
  }

  renderCurrentSlide(data) {
    const current = data.questions[data.current_slide];
    console.log(current.type);
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLStudentLobby data={data} goToNextSlide={this.goToNextSlide} />
        );
      // case 'CL-ST':
      //   return (
      //     <CLStudentStatic data={data} goToNextSlide={this.goToNextSlide} />
      //   );
      // case 'CL-SA':
      //   return (
      //     <CLStudentSingleAnswer data={data} goToNextSlide={this.goToNextSlide} />
      //   );
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
