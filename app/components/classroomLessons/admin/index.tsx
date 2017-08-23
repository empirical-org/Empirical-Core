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
          <li key={classroomLessonId} ><span>{data[classroomLessonId].title}</span><span><a href={`/#/admin/classroom-lessons/${classroomLessonId}`}>Edit</a> <a href={`/#/teach/class-lessons/${classroomLessonId}/preview`}>Preview</a></span></li>
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
