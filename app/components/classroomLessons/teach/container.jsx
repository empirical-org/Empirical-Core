import React, { Component } from 'react';
import { connect } from 'react-redux';

class TeachClassroomLessonContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Teacher Classroom
      </div>
    );
  }

}

function select(props) {
  return {
    // classroomSession: props.classroomSession,
    // classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(TeachClassroomLessonContainer);
