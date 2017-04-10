'use strict'
import React from 'react'
import $ from 'jquery'
import _ from 'underscore'

export default React.createClass({

  getInitialState: function() {
    return {
      classrooms: null,
      selectedClassroomId: this.props.currentClassroomId,
      switchingClassrooms: false
    }
  },

  componentDidMount: function() {
    $.ajax({url: '/students_classrooms_json', format: 'json', success: this.updateClassrooms})
  },

  updateClassrooms: function(data) {
    this.setState({classrooms: data.classrooms})
  },

  isActive: function(id, index) {
    if (id === this.state.selectedClassroomId) {
     return 'active';
     }
  },

  handleClassroomClick: function(classroomId) {
    if (!this.props.loading) {
      this.setState({
        selectedClassroomId: classroomId
      })
      this.props.fetchData(classroomId)
    }
  },

  mapClassrooms: function() {
    var that = this
    var classrooms = _.map(this.state.classrooms, function(classroom, index) {
      return (<div
        className={that.isActive(classroom.id, index) + ' classroom-box'}
        key={classroom.id}
        onClick={() => that.handleClassroomClick(classroom.id)}>
        <div>{classroom.teacher}</div>
      <div className="classroom-box-classroom">{classroom.name}</div>
    </div>)
    });
    return classrooms
  },

  render: function() {
    return(<div>{this.mapClassrooms()}</div>)
  }




})
