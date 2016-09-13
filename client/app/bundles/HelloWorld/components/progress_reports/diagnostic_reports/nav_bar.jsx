'use strict'

import React from 'react'
// import { Router, Route, Link, hashHistory } from 'react-router'
import ClassroomDropdown from '../../general_components/dropdown_selectors/classroom_dropdown.jsx'
import NavButtonGroup from './nav_button_group.jsx'
import StudentDropdown from '../../general_components/dropdown_selectors/student_dropdown.jsx'

export default React.createClass({
  propTypes: {
    classrooms: React.PropTypes.array.isRequired,
    studentDropdownCallBack: React.PropTypes.func,
    dropdownCallback: React.PropTypes.func,
    buttonGroupCallback: React.PropTypes.func,
    selectedClassroom: React.PropTypes.object,
    selectedStudentId: React.PropTypes.number,
    params: React.PropTypes.object
  },


  students: function(){
      if (this.props.selectedClassroom) {
       return this.props.selectedClassroom.students || null
     } else if (this.props.classrooms) {
       return this.props.classrooms[0].students
     }
  },

  studentDropdown: function(){
    let selectedStudent;
    let selectedStudentId = this.props.selectedStudentId
    if (selectedStudentId) {
      selectedStudent = this.students().find((student) => student.id === selectedStudentId)
    }
    if (this.props.showStudentDropdown) {
      return   <StudentDropdown
                          students = {this.students()}
                          callback ={this.props.studentDropdownCallback}
                          selectedStudent={selectedStudent || (this.students()[0] || null)}
                          />
    }
  },

  render: function() {
    return (
      <div className='diagnostic-nav-container'>
        <div id='reports-navbar'>
          <h1>Activity Name</h1>
          <p>Activity Info</p>
          <div className='nav-elements'>
            <ClassroomDropdown classrooms={this.props.classrooms || [{name: 'Please Add a Classroom', id: null}]}
                               callback={this.props.dropdownCallback}/>
            <NavButtonGroup params={this.props.params}
                            clickCallback={this.props.buttonGroupCallback}/>
            {this.studentDropdown()}
          </div>
        </div>
      </div>
    );
   }
 });
