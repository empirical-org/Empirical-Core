import React, { Component } from 'react';
import { connect } from 'react-redux';
import rootRef, { firebase } from '../../../libs/firebase';
import _ from 'lodash'
import {
  addLesson
} from '../../../actions/classroomLesson'

class ClassLessonsIndex extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      newLessonName: '',
      scores: {}
    }

    this.addLesson = this.addLesson.bind(this)
    this.changeNewLessonName = this.changeNewLessonName.bind(this)
    this.goToNewLesson = this.goToNewLesson.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.classroomLessonsReviews.hasreceiveddata !== nextProps.classroomLessonsReviews.hasreceiveddata) {
      this.scoreReviews(nextProps.classroomLessonsReviews.data)
    } else if (Object.keys(nextProps.classroomLessonsReviews.data).length > 0 && Object.keys(this.state.scores).length === 0) {
      this.scoreReviews(nextProps.classroomLessonsReviews.data)
    }
  }

  scoreReviews(allReviews) {
    const scoreObj = this.state.scores
    Object.keys(allReviews).forEach((lessonId) => {
      const lessonReviews = allReviews[lessonId]
      const reviewKeys = Object.keys(lessonReviews)
      const numberPoints = _.sumBy(reviewKeys, (rk) => {
        return lessonReviews[rk].value
      })
      const numberPointsPoss = reviewKeys.length * 2
      const percentage = ((numberPoints/numberPointsPoss) * 100).toFixed(2)
      scoreObj[lessonId] = percentage
    });
    this.setState({scores: scoreObj})
  }

  renderClassroomLessonList() {
    const scores = this.state.scores
    if (this.props.classroomLessons.hasreceiveddata) {
      const data = this.props.classroomLessons.data
      const components = Object.keys(data).map((classroomLessonId) => {
        const score = scores[classroomLessonId] ? `${scores[classroomLessonId]}%` : ''
        return (
          <li key={classroomLessonId} >
            <span>{data[classroomLessonId].title}</span>
            <span>
              <span>{score}</span>
              <a href={`/#/admin/classroom-lessons/${classroomLessonId}`}>Edit</a>
              <a target="_blank" href={`/#/teach/class-lessons/${classroomLessonId}/preview`}>Preview</a>
            </span>
          </li>
        )
      })
      return (
        <div>
          <h5 className="title is-5">All lessons</h5>
          <ul className="classroom-lessons-index">
            {components}
          </ul>
        </div>
    )
  }
}

  renderAddClassroomLesson() {
    if (this.props.classroomLessons.hasreceiveddata) {
      return (
        <div className="add-new-lesson-form">
          <h5 className="title is-5">Create a new lesson</h5>
          <p className="control has-addons">
            <input
              className="input is-expanded"
              type="text"
              placeholder="Algebra 101"
              value={this.state.newLessonName}
              onChange={this.changeNewLessonName}
            />
            <a className="button is-info" onClick={this.addLesson}>
              Add New Lesson
            </a>
          </p>
        </div>
      )
    }
  }

  addLesson() {
    addLesson(this.state.newLessonName, this.goToNewLesson)
  }

  goToNewLesson(lessonUID) {
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${lessonUID}`
  }

  changeNewLessonName(e) {
    this.setState({newLessonName: e.target.value})
  }

  render() {

    return (
      <div className="admin-classroom-lessons-container">
        {this.renderAddClassroomLesson()}
        {this.renderClassroomLessonList()}
      </div>
    );
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
    classroomLessonsReviews: props.classroomLessonsReviews
  };
}

export default connect(select)(ClassLessonsIndex);
