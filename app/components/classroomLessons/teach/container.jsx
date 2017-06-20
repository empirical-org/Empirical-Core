import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startListeningToSession, goToNextSlide } from '../../../actions/classroomSessions.js';
import CLLobby from './lobby.jsx';

class TeachClassroomLessonContainer extends Component {
  constructor(props) {
    super(props);
    this.renderCurrentSlide = this.renderCurrentSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(startListeningToSession(this.props.location.query.classroom_activity_id));
  }

  renderCurrentSlide(data) {
    const current = data.questions[data.current_slide];
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLLobby data={data} goToNextSlide={this.goToNextSlide} />
        );
        break;
      default:

    }
  }

  goToNextSlide() {
    this.props.dispatch(goToNextSlide(this.props.location.query.classroom_activity_id));
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

export default connect(select)(TeachClassroomLessonContainer);
