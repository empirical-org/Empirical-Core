import React, { Component } from 'react';
import { connect } from 'react-redux';

class ClassLessonsIndex extends Component<any, any> {
  constructor(props) {
    super(props);
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

  render() {

    return (
      <div>
        Lesson Index
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
