'use strict'

import React from 'react'
// import { Router, Route, Link, hashHistory } from 'react-router'
import ClassroomDropdown from '../../general_components/dropdown_selectors/classroom_dropdown.jsx'
import NavButtonGroup from './nav_button_group.jsx'
import StudentDropdown from '../../general_components/dropdown_selectors/student_dropdown.jsx'

export default React.createClass({
  propTypes: {
    classrooms: React.PropTypes.array.isRequired,
    students: React.PropTypes.array,
    selectedClassroom: React.PropTypes.obj,
    selectedStudentId: React.PropTypes.num,
    studentDropdownCallBack: React.PropTypes.function,
    dropdownCallback: React.PropTypes.function,
    buttonGroupCallback: React.PropTypes.function
  },


  students: function(){
      if (this.props.selectedClassroom && this.props.selectedClassroom.students) {
       return this.props.selectedClassroom.students
     } else if (this.props.classrooms) {
       return this.props.classrooms[0].students
     }
  },

  render: function() {
    return (
      <div id='reports-navbar'>
        <h1>Activity Name</h1>
        <p>Activity Info</p>
        <div className='nav-elements'>
          <ClassroomDropdown classrooms={this.props.classrooms || [{name: 'Please Add a Classroom', id: null}]}
                             selectedClassroom={this.props.selectedClassroom}
                             callback={this.props.dropdownCallback}/>
          <NavButtonGroup clickCallback={this.props.buttonGroupCallback}/>
          <StudentDropdown
                            selectedStudentId = {this.props.selectedStudentId}
                            students = {this.students()}
                            callback ={this.props.studentDropdownCallback}/>
        </div>
        {this.props.children}
      </div>
    );
   }
 });
