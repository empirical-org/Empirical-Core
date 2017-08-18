import React, {Component} from 'react'
import { connect } from 'react-redux';

class ShowClassroomLesson extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const title = this.props.classroomLessons.hasreceiveddata ? this.props.classroomLessons.data[this.props.routeParams.classroomLessonID].title : 'Loading'
    return (
      <div>
        <h1>{title}</h1>
      </div>
    )
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(ShowClassroomLesson)
