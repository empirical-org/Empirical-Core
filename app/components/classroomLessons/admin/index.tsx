import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addLesson
} from '../../../actions/classroomLesson'

class ClassLessonsIndex extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {newLessonName: ''}

    this.addLesson = this.addLesson.bind(this)
    this.changeNewLessonName = this.changeNewLessonName.bind(this)
  }

  renderClassroomLessonList() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const data = this.props.classroomLessons.data
      const components = Object.keys(data).map((classroomLessonId) => {
        return (
          <li key={classroomLessonId}><a href={`/#/admin/classroom-lessons/${classroomLessonId}`}>{data[classroomLessonId].title}</a></li>
        )
      })
      return (
      <ul>
        {components}
      </ul>
    )
  }
}

  renderAddClassroomLesson() {
    if (this.props.classroomLessons.hasreceiveddata) {
      return (
        <div className="add-new-lesson-form">
          <h5 className="title is-5">Create a new lesson</h5>
          <p className="control has-addons">
            <form onSubmit={this.addLesson}>
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
            </form>
          </p>
        </div>
      )
    }
  }

  addLesson() {
    addLesson(this.state.newLessonName)
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
  };
}

export default connect(select)(ClassLessonsIndex);
