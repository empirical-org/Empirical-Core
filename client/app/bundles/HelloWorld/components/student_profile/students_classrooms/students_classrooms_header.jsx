'use strict'
import React from 'react'
import $ from 'jquery'
import _ from 'underscore'


export default React.createClass({


  getInitialState: function() {
    return {classrooms: null}
  },

  componentDidMount: function() {
    $.ajax({url: 'students_classrooms_json', format: 'json', success: this.updateClassrooms})
  },

  updateClassrooms: function(data) {
    this.setState({classrooms: data.classrooms})
  },

  isActive: function(id, index) {
    if (id === this.props.currentClassroomId) {
     return 'active';
     }
  },

  mapClassrooms: function() {
    var that = this
    var classrooms = _.map(this.state.classrooms, function(classroom, index) {
      return (
        <div className={that.isActive(classroom.id, index) + ' classroom-box'} key={classroom.id} onClick={that.props.fetchData.bind(null, classroom.id)}>
          <div>{classroom.teacher}</div>
        <div>{classroom.name}</div>
      </div>
    )
    });
    return classrooms
  },

  render: function() {
    return(<div>{this.mapClassrooms()}</div>)
  }




})
