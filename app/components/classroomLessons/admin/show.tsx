import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName
} from './helpers'

class ShowClassroomLesson extends Component {
  constructor(props){
    super(props);
  }

  classroomLesson() {
    return this.props.classroomLessons.data[this.props.params.classroomLessonID]
  }

  renderSlides() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const questions = this.classroomLesson().questions
      const classroomLessonID = this.props.params.classroomLessonID
      const slides = Object.keys(questions).map(key => {
        return <li key={key}><a href={`/#/admin/classroom-lessons/${classroomLessonID}/slide/${key}`}><strong>{getComponentDisplayName(questions[key].type)}:</strong> {questions[key].data.teach.title}</a></li>
      })
      return <ul>{slides}</ul>
    }
  }

  render() {
    const title = this.props.classroomLessons.hasreceiveddata ? this.classroomLesson().title : 'Loading'
    return (
      <div>
        <h1>{title}</h1>
        {this.renderSlides()}
      </div>
    )
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(ShowClassroomLesson)
