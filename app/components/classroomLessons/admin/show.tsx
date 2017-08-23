import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  slideTypeKeys
} from './helpers'
import {
  addSlide,
  deleteLesson,
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
    this.deleteLesson = this.deleteLesson.bind(this)
    this.updateSlideOrder = this.updateSlideOrder.bind(this)
    this.selectNewSlideType = this.selectNewSlideType.bind(this)
    this.goToNewSlide = this.goToNewSlide.bind(this)
  }

  classroomLesson() {
    return this.props.classroomLessons.data[this.props.params.classroomLessonID]
  }

  goToNewSlide(slideID) {
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${this.props.params.classroomLessonID}/slide/${slideID}`
  }

  addSlide() {
    addSlide(this.props.params.classroomLessonID, this.classroomLesson(), this.state.newSlideType, this.goToNewSlide)
  }

  deleteLesson() {
    const confirmation = window.confirm('Are you sure you want to delete this lesson?')
    if (confirmation) {
      deleteLesson(this.props.params.classroomLessonID)
      window.location.href = `${window.location.origin}/#/admin/classroom-lessons/`
    }
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

  renderSlide(questions, classroomLessonID, key) {
    return (
      <div key={key} className="box slide-box">
        <span className="slide-type">{getComponentDisplayName(questions[key].type)}</span>
        <span className="slide-title">{questions[key].data.teach.title}</span>
        <span className="slide-edit"><a href={`/#/admin/classroom-lessons/${classroomLessonID}/slide/${key}`}>Edit Slide</a></span>
      </div>
    )
  }

  renderAddSlide() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const options = slideTypeKeys.map(key => <option key={key} value={key}>{getComponentDisplayName(key)}</option>)
      return (
        <div className="add-new-slide-form">
          <p className="control has-addons">
            <span className="select is-large">
              <select value={this.state.newSlideType} onChange={this.selectNewSlideType}>
                {options}
              </select>
            </span>
            <a className="button is-primary is-large"onClick={this.addSlide}>
              Add Slide
            </a>
          </p>
        </div>
      )
    }
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const questions = this.classroomLesson().questions
      const classroomLessonID = this.props.params.classroomLessonID
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <h5 className="title is-5">{this.classroomLesson().title}</h5>
            <button className="button is-danger" onClick={this.deleteLesson}>Delete Lesson</button>
          </div>
          <h5 className="title is-5">{questions.length} Slides</h5>
          {this.renderSlide(questions, classroomLessonID, 0)}
          {this.renderSortableMiddleSlides()}
          {this.renderAddSlide()}
          {this.renderSlide(questions, classroomLessonID, questions.length - 1)}
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
