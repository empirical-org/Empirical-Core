import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayLessonClassroomQuestion from './lessonClassroomQuestion.jsx';
import { startListeningToSession, registerPresence } from '../../../actions/classroomSessions.js';

class PlayLessonClassroomContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { classroom_activity_id, student, } = this.props.location.query;
    this.props.dispatch(startListeningToSession(classroom_activity_id));
    registerPresence(classroom_activity_id, student);
  }

  render() {
    const component = (<PlayLessonClassroomQuestion />);
    return (
      <div>
        <p>
          New Student Play Component
        </p>
        {component}
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
