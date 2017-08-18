import React, {Component} from 'react'
import { connect } from 'react-redux';

class ShowClassroomLessonSlide extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        New Component
      </div>
    )
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(ShowClassroomLessonSlide)
