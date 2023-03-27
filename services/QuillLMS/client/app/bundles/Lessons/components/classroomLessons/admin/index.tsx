import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    addLesson, listenForClassroomLessonReviews, listenForClassroomLessons
} from '../../../actions/classroomLesson';
import {
    startListeningToEditionMetadata
} from '../../../actions/customize';

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
    props.dispatch(listenForClassroomLessons());
    props.dispatch(listenForClassroomLessonReviews())
    props.dispatch(startListeningToEditionMetadata())
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
      const percentage = Math.round((numberPoints/numberPointsPoss) * 100)
      scoreObj[lessonId] = percentage
    });
    this.setState({scores: scoreObj})
  }

  renderClassroomLessonList() {
    const scores = this.state.scores
    const data = this.props.classroomLessons.data
    const components = Object.keys(data).map((classroomLessonId) => {
      const score = scores[classroomLessonId] ? `${scores[classroomLessonId]}%` : ''
      return (
        <li key={classroomLessonId} >
          <span>{data[classroomLessonId].title}</span>
          <span>
            <span>{score}</span>
            <a href={`/lessons/#/admin/classroom-lessons/${classroomLessonId}`}>Edit</a>
            |
            <a href={`/lessons/#/admin/classroom-lessons/${classroomLessonId}/editions`}>User Editions</a>
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

  renderAddClassroomLesson() {
    return (
      <div className="add-new-lesson-form">
        <h5 className="title is-5">Create a New lesson</h5>
        <p className="control has-addons">
          <input
            className="input is-expanded"
            onChange={this.changeNewLessonName}
            placeholder="Algebra 101"
            type="text"
            value={this.state.newLessonName}
          />
          <a className="button is-info" onClick={this.addLesson}>
            Add New Lesson
          </a>
        </p>
      </div>
    )
  }

  renderLinkToAllEditions() {
    return (
      <div className="all-editions-link">
        <a href="/lessons/#/admin/classroom-lessons/editions">See All User-Created Lesson Editions</a>
      </div>
    )
  }

  addLesson() {
    addLesson(this.state.newLessonName, this.goToNewLesson)
  }

  goToNewLesson(lessonUID) {
    window.location.href = `${window.location.origin}/lessons/#/admin/classroom-lessons/${lessonUID}`
  }

  changeNewLessonName(e) {
    this.setState({newLessonName: e.target.value})
  }

  render() {

    return (
      <div className="admin-classroom-lessons-container">
        {this.renderAddClassroomLesson()}
        {this.renderClassroomLessonList()}
        {this.renderLinkToAllEditions()}
      </div>
    );
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

export default connect(select, dispatch => ({dispatch}), mergeProps)(ClassLessonsIndex);
