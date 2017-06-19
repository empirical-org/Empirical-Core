import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayLessonClassroomQuestion from './lessonClassroomQuestion.jsx';

class PlayLessonClassroomContainer extends Component {
  constructor(props) {
    super(props);
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
    // lessons: state.lessons,
    // questions: state.questions,
    // sentenceFragments: state.sentenceFragments,
    // playLesson: props.playLesson,
    // classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(PlayLessonClassroomContainer);
