'use strict';
import React from 'react'
import StudentsClassroomsHeader from './students_classrooms/students_classrooms_header.jsx'

export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="section-header">{this.props.data.name}</span>
          <span className="pull-right student-course-info">
            <StudentsClassroomsHeader currentClassroomId={this.props.data.classroom.id} fetchData={this.props.fetchData}/>
          </span>
        </div>
      </div>
    )
  }
})
