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
    studentDropdownCallBack: React.PropTypes.func,
    dropdownCallback: React.PropTypes.func,
    buttonGroupCallback: React.PropTypes.func,
    selectedClassroom: React.PropTypes.object,
    selectedStudentId: React.PropTypes.string,
    params: React.PropTypes.object
  },


  students: function(){
    let selectedClassroomId = this.props.params.selectedClassroomId;
    if (this.props.students) {
      return this.props.students;
    } else if (selectedClassroomId) {
       return this.props.classrooms.find((cl)=>cl.id===selectedClassroomId).students || null;
    } else if (this.props.classrooms) {
       return this.props.classrooms[0].students;
    }
  },

  studentDropdown: function(){
    let selectedStudent;
    let studentId = this.props.params.studentId;
    if (studentId) {
      selectedStudent = this.students().find((student) => student.id === Number(studentId))
    }
    if (this.props.showStudentDropdown) {
      return   <StudentDropdown key={'student-dropdown'}
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
          <h1>{this.props.selectedActivity.name}      <div className="how-we-grade">
                  <p className="title title-not-started">
                    <a href="http://support.quill.org/knowledgebase/articles/545071-how-we-grade">How We Grade</a>
                    <a href=""><i className="fa fa-long-arrow-right"></i></a>
                  </p>
                </div></h1>
          <p>{this.props.selectedActivity.description}</p>
          <div className='nav-elements'>
            <ClassroomDropdown classrooms={this.props.classrooms || [{name: 'Please Add a Classroom', id: null}]}
                               callback={this.props.dropdownCallback}
                               selectedClassroom={this.props.classrooms.find((cl)=>cl.id===Number(this.props.params.classroomId))}/>
            <NavButtonGroup params={this.props.params}
                            clickCallback={this.props.buttonGroupCallback}/>
            {this.studentDropdown()}
          </div>
        </div>
      </div>
    );
   }
 });
