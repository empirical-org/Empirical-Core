'use strict'

import React from 'react'
export default React.createClass({

  manageClassGear: function() {
    return (
      <a className='pull-right class-gear' href={this.manageClassLink()}>
        <img src='/manage_class_icon.png'></img>
      </a>
    );
  },

  manageClassLink: function() {
    var classId = this.props.classObj.classroom.id.toString();
    return ('/teachers/classrooms/' + classId + '/students');
  },

  inviteStudentsLink: function() {
    var classId = this.props.classObj.classroom.id.toString();
    return ('/teachers/classrooms/' + classId + '/invite_students');
  },

  studentCount: function() {
    if (this.props.classObj.students !== 0) {
      return (this.props.classObj.students + ' Students');
    }
  },

  activityCount: function() {
    if (this.props.classObj.activities_completed !== 0) {
      return (this.props.classObj.activities_completed + ' Activities Completed');
    }
  },

  classroomSpecificButton: function() {
    if (!this.studentCount()) {
      return (
        <a href={this.inviteStudentsLink()}>
          <button className='button-green'>Invite Students</button>
        </a>
      );
    } else if (!this.activityCount()) {
      return (
        <a href="/teachers/classrooms/lesson_planner?tab=exploreActivityPacks">
          <button className='button-green'>Assign Activities</button>
        </a>
      );
    } else {
      return (
         <a href={"/teachers/classrooms/scorebook?classroom_id=" + this.props.classObj.classroom.id}>
          <button className='button-white class-mini-btn'>View Results</button>
        </a>
      );
    }
  },

  classroomMini: function() {
    return (
      <div>
        {this.manageClassGear()}
        <img className='class_icon' src='/class_icon.png'></img>
        <h3 className='classroom_name'>
          {this.props.classObj.classroom.name}</h3>
        <div className='classMetaData text-center'>
          <p>
            Class Code: {this.props.classObj.classroom.code}</p>
          <p>
            {this.studentCount()}
          </p>
          <p>
            <b>{this.activityCount()}</b>
          </p>
        </div>
        {this.classroomSpecificButton()}
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
        <div className ={"mini_content "}>
          {this.classroomMini()}
        </div>
      </div>
    );
  }
});
