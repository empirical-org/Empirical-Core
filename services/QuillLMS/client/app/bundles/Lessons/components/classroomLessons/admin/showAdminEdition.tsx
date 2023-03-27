import React, { Component } from 'react';

import { connect } from 'react-redux';
import { SortableList } from '../../../../Shared/index';

import DeleteSlideButton from './deleteSlideButton';
import EditEditionDetails from './editEditionDetails';

import {
  getComponentDisplayName,
  slideTypeKeys
} from './helpers';

import {
  addSlide,
  deleteEdition, deleteEditionSlide, updateEditionDetails, updateEditionSlides
} from '../../../actions/classroomLesson';


import { getEditionQuestions } from '../../../actions/customize';

class ShowAdminEdition extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      newSlideType: 'CL-ST'
    }

    props.dispatch(getEditionQuestions(props.match.params.editionID))
  }

  classroomLesson = () => {
    const { classroomLessons, match, } = this.props
    return classroomLessons.data[match.params.classroomLessonID]
  }

  edition = () => {
    const { customize, match, } = this.props
    return customize.editions[match.params.editionID]
  }

  loaded = () => {
    const { customize, } = this.props
    return customize.editions && Object.keys(customize.editions).length > 0 && this.edition() && this.editionQuestions() && this.editionQuestions().length > 0
  }

  editionQuestions = () => {
    const { customize, } = this.props
    return customize.editionQuestions ? customize.editionQuestions.questions : null
  }

  goToNewSlide = (slideID) => {
    const { match, } = this.props
    const { params, } = match
    window.location.href = `${window.location.origin}/lessons/#/admin/classroom-lessons/${params.classroomLessonID}/editions/${params.editionID}/slide/${slideID}`
  }

  handleAddSlideClick = () => {
    const { match, customize, } = this.props
    const { newSlideType, } = this.state
    const { params, } = match
    addSlide(params.editionID, customize.editionQuestions, newSlideType, this.goToNewSlide)
  }

  deleteEdition = () => {
    const { dispatch, match, } = this.props
    const { params, } = match

    const confirmation = window.confirm('Are you sure you want to delete this edition?')
    if (confirmation) {
      dispatch(deleteEdition(params.editionID, () => window.location.href = `${window.location.origin}/lessons/#/admin/classroom-lessons/${params.classroomLessonID}`))
    }
  }

  saveEditionDetails = (edition) => {
    const { dispatch, match, } = this.props
    const { params, } = match

    dispatch(updateEditionDetails(params.editionID, edition))
  }

  handleSelectNewSlideType = (e) => {
    this.setState({ newSlideType: e.target.value })
  }

  updateSlideOrder = (sortInfo) => {
    const { match, } = this.props
    const { params, } = match
    const originalSlides = this.editionQuestions()
    const newOrder = sortInfo.map(item => item.key);
    const firstSlide = originalSlides[0]
    const middleSlides = newOrder.map((key) => originalSlides[key])
    const lastSlide = originalSlides[originalSlides.length - 1]
    const newSlides = [firstSlide].concat(middleSlides).concat([lastSlide])
    updateEditionSlides(params.editionID, newSlides)
  }

  deleteSlide = (slideID) => {
    const { match, } = this.props
    const { params, } = match
    const confirmation = window.confirm('Are you sure you want to delete this slide?')
    if (confirmation) {
      const slides = this.editionQuestions()
      deleteEditionSlide(params.editionID, slideID, slides)
    }
  }

  renderSortableMiddleSlides = () => {
    const { match, } = this.props
    const { params, } = match
    if (this.loaded()) {
      const questions = this.editionQuestions()
      const slides = Object.keys(questions).slice(1, -1).map(key => this.renderSlide(questions, params.editionID, key))
      return <SortableList data={slides} sortCallback={this.updateSlideOrder} />
    }
  }

  renderSlide = (questions, editionId, key) => {
    const { match, } = this.props
    const { params, } = match

    const exitSlideIndex = questions.length - 1
    const deleteSlideButton = key === 0 || key === exitSlideIndex ? <span /> : <DeleteSlideButton deleteSlide={this.deleteSlide} slideKey={key} />
    return (
      <div className="box slide-box" key={key}>
        <span className="slide-type">{getComponentDisplayName(questions[key].type)}</span>
        <span className="slide-title">{questions[key].data.teach.title}</span>
        {deleteSlideButton}
        <span className="slide-edit"><a href={`/lessons/#/admin/classroom-lessons/${params.classroomLessonID}/editions/${editionId}/slide/${key}`}>Edit Slide</a></span>
      </div>
    )
  }

  renderAddSlide = () => {
    const { newSlideType, } = this.state
    if (this.loaded()) {
      const options = slideTypeKeys.map(key => <option key={key} value={key}>{getComponentDisplayName(key)}</option>)
      return (
        <div className="add-new-slide-form">
          <p className="control has-addons">
            <span className="select is-large">
              <select onChange={this.handleSelectNewSlideType} value={newSlideType}>
                {options}
              </select>
            </span>
            <a className="button is-primary is-large" onClick={this.handleAddSlideClick}>
              Add Slide
            </a>
          </p>
        </div>
      )
    }
  }

  render() {
    const { classroomLessons, match, } = this.props
    const { params, } = match
    if (this.loaded() && classroomLessons.hasreceiveddata) {
      const questions = this.editionQuestions()
      const editionId = params.editionID
      /* eslint-disable react/jsx-no-target-blank */
      const editionHeader = <h4 className="title is-4">Edition: {this.edition().name} <a href={`/lessons/#/teach/class-lessons/${params.classroomLessonID}/preview/${params.editionID}`} target="_blank">Preview</a> </h4>
      /* eslint-enable react/jsx-no-target-blank */
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <div className="top-line">
              <h5 className="title is-4">Lesson: {this.classroomLesson().title}</h5>
              <a href="https://docs.google.com/document/d/1oc3IlB4pDPUFcFLl4eHItPinC9GEKvblkifIKStMSmQ/edit">Quill Lessons Style Guide</a>
            </div>
            {editionHeader}
            <EditEditionDetails deleteEdition={this.deleteEdition} edition={this.edition()} save={this.saveEditionDetails} />
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
