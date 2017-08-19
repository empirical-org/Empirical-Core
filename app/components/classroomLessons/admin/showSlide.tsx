import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  getComponent
} from './helpers'

class ShowClassroomLessonSlide extends Component {
  constructor(props){
    super(props);
  }

  classroomLesson() {
    return this.props.classroomLessons.data[this.props.params.classroomLessonID]
  }

  currentSlide() {
    return this.classroomLesson().questions[this.props.params.slideID]
  }

  getComponent(type: string) {

  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const Component = getComponent(this.currentSlide().type)
      console.log(Component)
      return (
        <div>
          <h4 className="title is-4">
            {this.classroomLesson().title}
          </h4>
          <h5 className="title is-5">
            {this.currentSlide().data.teach.title}
          </h5>
          <p>{getComponentDisplayName(this.currentSlide().type)}</p>
          <Component />
        </div>
      )
    } else {
      return (<p>Loading...</p>)
    }

  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(ShowClassroomLessonSlide)
