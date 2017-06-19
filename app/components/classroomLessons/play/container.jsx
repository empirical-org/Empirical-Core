import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayLessonClassroomQuestion from './lessonClassroomQuestion.jsx';
import { startListeningToSession } from '../../../actions/classroomSessions.js';

class PlayLessonClassroomContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(startListeningToSession(this.props.location.query.classroom_activity_id));
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
