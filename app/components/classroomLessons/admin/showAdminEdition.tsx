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

class ShowClassroomEdition extends Component<any, any> {
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
  }

  componentDidMount() {
    const lessonId = this.props.params.editionId
    if (this.props.classroomEditionsReviews.hasreceiveddata) {
      const reviews = this.props.classroomEditionsReviews.data[lessonId]
      if (reviews) {
        this.scoreReviews(reviews)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.classroomEditionsReviews.hasreceiveddata !== nextProps.classroomEditionsReviews.hasreceiveddata) {
      const lessonId = nextProps.params.editionId
      const reviews = nextProps.classroomEditionsReviews.data[lessonId]
      if (reviews) {
        this.scoreReviews(reviews)
      }
    }
  }

  scoreReviews(reviews) {
    const reviewKeys = Object.keys(reviews)
    if (reviewKeys.length > 0) {
      const numberPoints = _.sumBy(reviewKeys, (rk) => reviews[rk].value)
      const numberPointsPoss = reviewKeys.length * 2
      const percentage = Math.round((numberPoints/numberPointsPoss) * 100)
      this.setState({reviewPercentage: percentage})
    };
  }

  classroomEdition() {
    return this.props.classroomEditions.data[this.props.params.editionId]
  }

  goToNewSlide(slideID) {
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${this.props.params.editionId}/slide/${slideID}`
  }

  addSlide() {
    addSlide(this.props.params.editionId, this.classroomEdition(), this.state.newSlideType, this.goToNewSlide)
  }

  deleteEdition() {
    const confirmation = window.confirm('Are you sure you want to delete this edition?')
    if (confirmation) {
      deleteEdition(this.props.params.editionId)
      window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${this.props.params.lessonId}`
    }
  }

  saveEditionDetails(edition) {
    updateEditionDetails(this.props.params.editionId, edition)
  }

  selectNewSlideType(e) {
    this.setState({newSlideType: e.target.value})
  }

  updateSlideOrder(sortInfo) {
    const originalSlides = this.classroomEdition().questions
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
      const {editionId} = this.props.params;
      const slides = this.classroomEdition().questions
      deleteEditionSlide(editionId, slideID, slides)
    }
  }

  renderSortableMiddleSlides() {
    if (this.props.classroomEditions.hasreceiveddata) {
      const questions = this.classroomEdition().questions
      const editionId = this.props.params.editionId
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
        <span className="slide-edit"><a href={`/#/admin/classroom-lessons/${editionId}/slide/${key}`}>Edit Slide</a></span>
      </div>
    )
  }

  renderAddSlide() {
    if (this.props.classroomEditions.hasreceiveddata) {
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
    if (this.props.classroomEditions.hasreceiveddata) {
      const questions = this.classroomEdition().questions
      const editionId = this.props.params.editionId
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <h4 className="title is-4">{this.classroomEdition().title} <a target="_blank" href={`/#/teach/class-lessons/${editionId}/preview`}>Preview</a> </h4>
            <h5 className="title is-5">{this.renderPercentage()}</h5>
            <EditEditionDetails classroomEdition={this.classroomEdition()} save={this.saveEditionDetails} deleteEdition={this.deleteEdition} />
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
    classroomEditions: props.classroomEditions,
    classroomEditionsReviews: props.classroomEditionsReviews
  };
}

export default connect(select)(ShowClassroomEdition)
