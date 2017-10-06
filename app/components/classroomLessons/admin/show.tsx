import React, {Component} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash'
import {
  getComponentDisplayName,
  slideTypeKeys
} from './helpers'
import {
  addSlide,
  deleteLesson,
  updateClassroomLessonSlides,
  updateClassroomLessonDetails,
  deleteClassroomLessonSlide
} from '../../../actions/classroomLesson'
import EditLessonDetails from './editLessonDetails'
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
    this.saveLessonDetails = this.saveLessonDetails.bind(this)
    this.updateReviewPercentage = this.updateReviewPercentage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.classroomLessonsReviews.hasreceiveddata !== nextProps.classroomLessonsReviews.hasreceiveddata) {
      const lessonId = nextProps.params.classroomLessonID
      const reviews = nextProps.classroomLessonsReviews.data[lessonId]
      const reviewKeys = Object.keys(reviews)
      if (reviewKeys.length > 0) {
        const numberPoints = _.sumBy(reviewKeys, (rk) => reviews[rk].value)
        const numberPointsPoss = reviewKeys.length * 2
        const percentage = ((numberPoints/numberPointsPoss) * 100).toFixed(2)
        this.updateReviewPercentage(percentage)
      };
    }
  }

  updateReviewPercentage(reviewPercentage) {
    this.setState({reviewPercentage})
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

  saveLessonDetails(lesson) {
    updateClassroomLessonDetails(this.props.params.classroomLessonID, lesson)
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

  deleteSlide(slideID) {
    const confirmation = window.confirm('Are you sure you want to delete this slide?')
    if (confirmation) {
      const {classroomLessonID} = this.props.params;
      const slides = this.classroomLesson().questions
      deleteClassroomLessonSlide(classroomLessonID, slideID, slides)
    }
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
    const exitSlideIndex = questions.length - 1
    const deleteSlideButton = key === 0 || key === exitSlideIndex ? <span /> : <span className="slide-delete" onClick={() => this.deleteSlide(key)}>Delete Slide</span>
    return (
      <div key={key} className="box slide-box">
        <span className="slide-type">{getComponentDisplayName(questions[key].type)}</span>
        <span className="slide-title">{questions[key].data.teach.title}</span>
        {deleteSlideButton}
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
            <a className="button is-primary is-large" onClick={this.addSlide}>
              Add Slide
            </a>
          </p>
        </div>
      )
    }
  }

  renderPercentage() {
    if (this.state.reviewPercentage) {
      return <span>{this.state.reviewPercentage}% Approval</span>
    }
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const questions = this.classroomLesson().questions
      const classroomLessonID = this.props.params.classroomLessonID
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <h4 className="title is-4">{this.classroomLesson().title} <a target="_blank" href={`/#/teach/class-lessons/${classroomLessonID}/preview`}>Preview</a> </h4>
            <h5 className="title is-5">{this.renderPercentage()}</h5>
            <EditLessonDetails classroomLesson={this.classroomLesson()} save={this.saveLessonDetails} deleteLesson={this.deleteLesson} />
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
    classroomLessonsReviews: props.classroomLessonsReviews
  };
}

export default connect(select)(ShowClassroomLesson)
