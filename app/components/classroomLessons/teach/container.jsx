import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startListeningToSession } from '../../../actions/classroomSessions.js';
import CLLobby from './lobby.jsx';

class TeachClassroomLessonContainer extends Component {
  constructor(props) {
    super(props);
    this.renderCurrentSlide = this.renderCurrentSlide.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(startListeningToSession(this.props.location.query.classroom_activity_id));
  }

  renderCurrentSlide(data) {
    const current = data.questions[data.current_slide];
    switch (current.type) {
      case 'CL-LB':
        return (
          <CLLobby data={data} />
        );
        break;
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

export default connect(select)(TeachClassroomLessonContainer);
