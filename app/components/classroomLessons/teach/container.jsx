import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startListeningToSession } from '../../../actions/classroomSessions.js';

class TeachClassroomLessonContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(startListeningToSession(this.props.location.query.classroom_activity_id));
  }

  render() {
    console.log(this.props.classroomSessions);
    return (
      <div>
        Teacher Classroom
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
