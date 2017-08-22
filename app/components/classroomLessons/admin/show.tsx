import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  slideTypeKeys
} from './helpers'
import {
  addSlide,
  updateClassroomLessonSlides
} from '../../../actions/classroomLesson'
import SortableList from '../../questions/sortableList/sortableList.jsx';

class ShowClassroomLesson extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      newSlideType: 'CL-ST'
    }

    this.addSlide = this.addSlide.bind(this)
    this.updateSlideOrder = this.updateSlideOrder.bind(this)
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

  updateSlideOrder(sortInfo) {
    const originalSlides = this.classroomLesson().questions
    const newOrder = sortInfo.data.items.map(item => item.key);
    const firstSlide = originalSlides[0]
    const middleSlides = newOrder.map((key) => originalSlides[key])
    const lastSlide = originalSlides[originalSlides.length - 1]
    const newSlides = [firstSlide].concat(middleSlides).concat([lastSlide])
    updateClassroomLessonSlides(this.props.params.classroomLessonID, newSlides)
  }

  renderSortableMiddleSlides() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const questions = this.classroomLesson().questions
      const classroomLessonID = this.props.params.classroomLessonID
      const slides = Object.keys(questions).slice(1, -1).map(key => this.renderSlide(questions, classroomLessonID, key))
      return <SortableList data={slides} sortCallback={this.updateSlideOrder} />
    }
  }

  renderSlide = (questions, classroomLessonID, key) => <div key={key} className="box"><a href={`/#/admin/classroom-lessons/${classroomLessonID}/slide/${key}`}><strong>{getComponentDisplayName(questions[key].type)}:</strong> {questions[key].data.teach.title}</a></div>

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
    if (this.props.classroomLessons.hasreceiveddata) {
      const questions = this.classroomLesson().questions
      const classroomLessonID = this.props.params.classroomLessonID
      return (
        <div>
          <h1>{this.classroomLesson().title}</h1>
          {this.renderSlide(questions, classroomLessonID, 0)}
          {this.renderSortableMiddleSlides()}
          {this.renderSlide(questions, classroomLessonID, questions.length - 1)}
          {this.renderAddSlide()}
        </div>
      )
    } else {
      return <h1>Loading</h1>
    }
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(ShowClassroomLesson)
