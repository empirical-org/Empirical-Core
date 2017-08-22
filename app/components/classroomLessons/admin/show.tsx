import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  slideTypeKeys
} from './helpers'
import {
  addSlide
} from '../../../actions/classroomLesson'

class ShowClassroomLesson extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      newSlideType: 'CL-ST'
    }

    this.addSlide = this.addSlide.bind(this)
    this.selectNewSlideType = this.selectNewSlideType.bind(this)
  }

  classroomLesson() {
    return this.props.classroomLessons.data[this.props.params.classroomLessonID]
  }

  addSlide() {
    addSlide(this.props.params.classroomLessonID, this.classroomLesson(), this.state.newSlideType)
  }

  selectNewSlideType(e) {
    this.setState({newSlideType: e.target.value})
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

  renderAddSlide() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const options = slideTypeKeys.map(key => <option key={key} value={key}>{getComponentDisplayName(key)}</option>)
      return <div>
        <select value={this.state.newSlideType} onChange={this.selectNewSlideType}>{options}</select>
        <button onClick={this.addSlide}>Add Slide</button>
      </div>
    }
  }

  render() {
    const title = this.props.classroomLessons.hasreceiveddata ? this.classroomLesson().title : 'Loading'
    return (
      <div>
        <h1>{title}</h1>
        {this.renderSlides()}
        {this.renderAddSlide()}
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
