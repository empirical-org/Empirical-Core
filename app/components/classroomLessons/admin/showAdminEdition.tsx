import React, {Component} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash'
import {
  getComponentDisplayName,
  slideTypeKeys
} from './helpers'
import {
  addSlide,
  deleteEdition,
  updateEditionSlides,
  updateEditionDetails,
  deleteEditionSlide
} from '../../../actions/classroomLesson'
import EditEditionDetails from './editEditionDetails'
import SortableList from '../../questions/sortableList/sortableList.jsx';
import { getEditionQuestions } from '../../../actions/customize'

class ShowAdminEdition extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      newSlideType: 'CL-ST'
    }

    this.addSlide = this.addSlide.bind(this)
    this.deleteEdition = this.deleteEdition.bind(this)
    this.updateSlideOrder = this.updateSlideOrder.bind(this)
    this.selectNewSlideType = this.selectNewSlideType.bind(this)
    this.goToNewSlide = this.goToNewSlide.bind(this)
    this.saveEditionDetails = this.saveEditionDetails.bind(this)

    this.props.dispatch(getEditionQuestions(this.props.params.editionID))
  }

  classroomLesson() {
    return this.props.classroomLessons.data[this.props.params.classroomLessonID]
  }

  edition() {
    return this.props.customize.editions[this.props.params.editionID]
  }

  loaded() {
    return this.props.customize.editions && Object.keys(this.props.customize.editions).length > 0 && this.edition() && this.editionQuestions() && this.editionQuestions().length > 0
  }

  editionQuestions() {
    return this.props.customize.editionQuestions ? this.props.customize.editionQuestions.questions : null
  }

  goToNewSlide(slideID) {
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${this.props.params.classroomLessonID}/editions/${this.props.params.editionID}/slide/${slideID}`
  }

  addSlide() {
    addSlide(this.props.params.editionID, this.props.customize.editionQuestions, this.state.newSlideType, this.goToNewSlide)
  }

  deleteEdition() {
    const confirmation = window.confirm('Are you sure you want to delete this edition?')
    if (confirmation) {
      deleteEdition(this.props.params.editionID, () => window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${this.props.params.classroomLessonID}`)
    }
  }

  saveEditionDetails(edition) {
    updateEditionDetails(this.props.params.editionID, edition)
  }

  selectNewSlideType(e) {
    this.setState({newSlideType: e.target.value})
  }

  updateSlideOrder(sortInfo) {
    const originalSlides = this.editionQuestions()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const firstSlide = originalSlides[0]
    const middleSlides = newOrder.map((key) => originalSlides[key])
    const lastSlide = originalSlides[originalSlides.length - 1]
    const newSlides = [firstSlide].concat(middleSlides).concat([lastSlide])
    updateEditionSlides(this.props.params.editionID, newSlides)
  }

  deleteSlide(slideID) {
    const confirmation = window.confirm('Are you sure you want to delete this slide?')
    if (confirmation) {
      const {editionID} = this.props.params;
      const slides = this.editionQuestions()
      deleteEditionSlide(editionID, slideID, slides)
    }
  }

  renderSortableMiddleSlides() {
    if (this.loaded()) {
      const questions = this.editionQuestions()
      const editionId = this.props.params.editionID
      const slides = Object.keys(questions).slice(1, -1).map(key => this.renderSlide(questions, editionId, key))
      return <SortableList data={slides} sortCallback={this.updateSlideOrder} />
    }
  }

  renderSlide(questions, editionId, key) {
    const exitSlideIndex = questions.length - 1
    const deleteSlideButton = key === 0 || key === exitSlideIndex ? <span /> : <span className="slide-delete" onClick={() => this.deleteSlide(key)}>Delete Slide</span>
    return (
      <div key={key} className="box slide-box">
        <span className="slide-type">{getComponentDisplayName(questions[key].type)}</span>
        <span className="slide-title">{questions[key].data.teach.title}</span>
        {deleteSlideButton}
        <span className="slide-edit"><a href={`/#/admin/classroom-lessons/${this.props.params.classroomLessonID}/editions/${editionId}/slide/${key}`}>Edit Slide</a></span>
      </div>
    )
  }

  renderAddSlide() {
    if (this.loaded()) {
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

  render() {
    if (this.loaded() && this.props.classroomLessons.hasreceiveddata) {
      const questions = this.editionQuestions()
      const editionId = this.props.params.editionID
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <h4 className="title is-4">Lesson: <a href={`/#/admin/classroom-lessons/${this.props.params.classroomLessonID}`}>{this.classroomLesson().title} </a> </h4>
            <h4 className="title is-4">Edition: {this.edition().name} <a target="_blank" href={`/#/teach/class-lessons/${this.props.params.classroomLessonID}/preview/${this.props.params.editionID}`}>Preview</a> </h4>
            <EditEditionDetails edition={this.edition()} save={this.saveEditionDetails} deleteEdition={this.deleteEdition} />
          </div>
          <h5 className="title is-5">{questions.length} Slides</h5>
          {this.renderSlide(questions, editionId, 0)}
          {this.renderSortableMiddleSlides()}
          {this.renderAddSlide()}
          {this.renderSlide(questions, editionId, questions.length - 1)}
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
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ShowAdminEdition);
