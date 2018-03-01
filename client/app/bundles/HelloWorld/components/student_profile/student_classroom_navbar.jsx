'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import StudentsClassroomsHeader from './students_classrooms/students_classrooms_header.jsx';

export default  createReactClass({
  propTypes: {
    data: PropTypes.object.isRequired
  },

  render: function () {
    return (
            <StudentsClassroomsHeader currentClassroomId={this.props.data.classroom.id} fetchData={this.props.fetchData} loading={this.props.loading}/>
    )
  }
})
