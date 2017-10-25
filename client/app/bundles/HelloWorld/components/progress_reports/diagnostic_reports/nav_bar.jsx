import React from 'react';
// import { Router, Route, Link, hashHistory } from 'react-router'
import ClassroomDropdown from '../../general_components/dropdown_selectors/classroom_dropdown.jsx';
import NavButtonGroup from './nav_button_group.jsx';
import StudentDropdown from '../../general_components/dropdown_selectors/student_dropdown.jsx';
import $ from 'jquery';

export default React.createClass({
  propTypes: {
    classrooms: React.PropTypes.array.isRequired,
    students: React.PropTypes.array,
    studentDropdownCallBack: React.PropTypes.func,
    dropdownCallback: React.PropTypes.func,
    buttonGroupCallback: React.PropTypes.func,
    selectedClassroom: React.PropTypes.object,
    selectedStudentId: React.PropTypes.string,
    params: React.PropTypes.object,
  },

  componentWillMount() {
    if (window.location.hash.includes('/a/413', '/a/447', '/a/602')) {
      $('.activity-analysis-tab').removeClass('active');
      $('.diagnostic-tab').addClass('active');
    } else {
      $('.diagnostic-tab').removeClass('active');
      $('.activity-analysis-tab').addClass('active');
    }
  },

  students() {
    const selectedClassroomId = parseInt(this.props.params.classroomId);
    if (this.props.students) {
      return this.props.students;
    } else if (selectedClassroomId) {
      return this.props.classrooms.find(cl => cl.id === selectedClassroomId).students || null;
    } else if (this.props.classrooms) {
      return this.props.classrooms[0].students;
    }
  },

  studentDropdown() {
    let selectedStudent;
    const studentId = this.props.params.studentId;
    if (studentId) {
      selectedStudent = this.students().find(student => student.id === Number(studentId));
    }
    if (this.props.showStudentDropdown) {
      return (<StudentDropdown
        key={studentId}
        students={this.students()}
        callback={this.props.studentDropdownCallback}
        selectedStudent={selectedStudent || (this.students()[0] || null)}
      />);
    }
  },

  render() {
    return (
      <div className="diagnostic-nav-container">
        <div id="reports-navbar">
          <h1>{this.props.selectedActivity.name}</h1>
          <p>{this.props.selectedActivity.description}</p>
          <div className="nav-elements">
            <ClassroomDropdown
              classrooms={this.props.classrooms || [{ name: 'Please Add a Classroom', id: null, }]}
              callback={this.props.dropdownCallback}
              selectedClassroom={this.props.classrooms.find(cl => cl.id === Number(this.props.params.classroomId))}
            />
            <NavButtonGroup
              params={this.props.params}
              clickCallback={this.props.buttonGroupCallback}
            />
            {this.studentDropdown()}
          </div>
        </div>
      </div>
    );
  },
});
