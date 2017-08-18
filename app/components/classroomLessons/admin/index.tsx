import React, { Component } from 'react';
import { connect } from 'react-redux';

class ClassLessonsIndex extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <div>
        Lesson Index
      </div>
    );
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(ClassLessonsIndex);
