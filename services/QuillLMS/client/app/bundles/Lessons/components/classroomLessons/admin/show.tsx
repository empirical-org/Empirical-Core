import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteLesson,
    updateClassroomLessonDetails
} from '../../../actions/classroomLesson';
import { createNewAdminEdition } from '../../../actions/customize';
import EditLessonDetails from './editLessonDetails';

class ShowClassroomLesson extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      newEditionName: ''
    }

    this.deleteLesson = this.deleteLesson.bind(this)
    this.saveLessonDetails = this.saveLessonDetails.bind(this)
    this.changeNewEditionName = this.changeNewEditionName.bind(this)
    this.addEdition = this.addEdition.bind(this)
    this.copyEdition = this.copyEdition.bind(this)
  }

  componentDidMount() {
    const lessonId = this.props.match.params.classroomLessonID
    if (this.props.classroomLessonsReviews.hasreceiveddata) {
      const reviews = this.props.classroomLessonsReviews.data[lessonId]
      if (reviews) {
        this.scoreReviews(reviews)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.classroomLessonsReviews.hasreceiveddata !== nextProps.classroomLessonsReviews.hasreceiveddata) {
      const lessonId = nextProps.match.params.classroomLessonID
      const reviews = nextProps.classroomLessonsReviews.data[lessonId]
      if (reviews) {
        this.scoreReviews(reviews)
      }
    }
  }

  classroomLesson() {
    return this.props.classroomLessons.data[this.props.match.params.classroomLessonID]
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

  deleteLesson() {
    const confirmation = window.confirm('Are you sure you want to delete this lesson?')
    if (confirmation) {
      deleteLesson(this.props.match.params.classroomLessonID)
      window.location.href = `${window.location.origin}/lessons/#/admin/classroom-lessons/`
    }
  }

  saveLessonDetails(lesson) {
    this.props.dispatch(updateClassroomLessonDetails(this.props.match.params.classroomLessonID, lesson))
  }

  addEdition() {
    if (this.state.newEditionName) {
      createNewAdminEdition(null, this.props.match.params.classroomLessonID, 'quill-staff', null, this.state.newEditionName)
    } else {
      alert('Name the new edition!')
    }
  }

  copyEdition(editionID) {
    createNewAdminEdition(editionID, this.props.match.params.classroomLessonID, 'quill-staff', null, 'New Edition')
  }

  changeNewEditionName(e) {
    this.setState({newEditionName: e.target.value})
  }

  renderPercentage() {
    if (this.state.reviewPercentage) {
      return <span>{this.state.reviewPercentage}% Approval</span>
    }
  }

  renderEditionsList() {
    const editions = Object.keys(this.props.customize.editions).map(e => {
      const edition = this.props.customize.editions[e]
      if (edition.user_id === 'quill-staff' && edition.lesson_id === this.props.match.params.classroomLessonID) {
        return (
          <li>
            <div>{edition.name}</div>
            <div>
              <span onClick={() => this.props.history.push(`/admin/classroom-lessons/${edition.lesson_id}/editions/${e}`)} style={{margin: '0px 5px'}}>Edit</span>
            |
              <span onClick={() => this.props.history.push(`/teach/class-lessons/${edition.lesson_id}/preview/${e}`)} style={{margin: '0px 5px'}}>Preview</span>
            |
              <span onClick={() => this.copyEdition(e)} style={{margin: '0px 5px'}}>Make A Copy</span>
            </div>
          </li>
        )
      }
    })
    const components = _.compact(editions)
    return (
      <div>
        <h5 className="title is-5">Quill Editions</h5>
        <ul className="classroom-lessons-index">
          {components.length > 0 ? components : 'No editions yet! Create one above.'}
        </ul>
      </div>
    )
  }

  renderAddEdition() {
    return (
      <div className="add-new-lesson-form">
        <h5 className="title is-5">Create a new edition</h5>
        <p className="control has-addons">
          <input
            className="input is-expanded"
            onChange={this.changeNewEditionName}
            placeholder="Generic Edition"
            type="text"
            value={this.state.newEditionName}
          />
          <a className="button is-info" onClick={this.addEdition}>
            Add New Edition
          </a>
        </p>
      </div>
    )
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata && this.classroomLesson()) {
      const classroomLessonID = this.props.match.params.classroomLessonID
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <div className="top-line">
              <h5 className="title is-4">Lesson: {this.classroomLesson().title}</h5>
              <a href="https://docs.google.com/document/d/1oc3IlB4pDPUFcFLl4eHItPinC9GEKvblkifIKStMSmQ/edit">Quill Lessons Style Guide</a>
            </div>
            <h5 className="title is-5">{this.renderPercentage()}</h5>
            <EditLessonDetails classroomLesson={this.classroomLesson()} deleteLesson={this.deleteLesson} save={this.saveLessonDetails} />
          </div>
          {this.renderAddEdition()}
          {this.renderEditionsList()}
          <br />
          <a className='button is-info' href={`/lessons/#/admin/classroom-lessons/${classroomLessonID}/editions`} style={{fontSize: 16}}>User Editions</a>
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
    classroomLessonsReviews: props.classroomLessonsReviews,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ShowClassroomLesson);
