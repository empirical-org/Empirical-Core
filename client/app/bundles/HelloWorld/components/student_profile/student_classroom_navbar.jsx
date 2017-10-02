'use strict';
import React from 'react'
import StudentsClassroomsHeader from './students_classrooms/students_classrooms_header.jsx'

export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
            <StudentsClassroomsHeader currentClassroomId={this.props.data.classroom.id} fetchData={this.props.fetchData} loading={this.props.loading}/>
    )
  }
})
