import React from 'react';
// import { Router, Route, Link, hashHistory } from 'react-router'
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx';
import NavButtonGroup from './nav_button_group.jsx';
import StudentDropdown from '../../general_components/dropdown_selectors/student_dropdown.jsx';
import blackIconAppName from '../../modules/get_black_icon_app_name_from_classification.js'
import l from 'lodash'
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
    let appName, image, previewLink
    if (l.has(this.props.selectedActivity, 'classification.id')) {
      appName = blackIconAppName(this.props.selectedActivity.classification.id)
      image = <img src={`https://assets.quill.org/images/icons/${appName}-black.svg`} alt={`${appName}-icon`}/>
      previewLink = <a href={`/activity_sessions/anonymous?activity_id=${this.props.selectedActivity.id}`}>Preview Activity</a>
    }
    return (
      <div className="diagnostic-nav-container">
        <div id="reports-navbar">
          <div className='name-and-preview flex-row name-and-preview flex-row vertically-centered'>
            {image}
            <h1>{this.props.selectedActivity ? this.props.selectedActivity.name : ''}</h1>
            {previewLink}
          </div>

          <p className='description'>
            <img src='https://assets.quill.org/images/icons/info-black.svg' alt="info-icon"/>
            {this.props.selectedActivity.description}
          </p>

          <p className='standard'>
            <img src='https://assets.quill.org/images/icons/common-core-gray.svg' alt="common-core-icon"/>
            {this.props.selectedActivity && this.props.selectedActivity.topic ? this.props.selectedActivity.topic.name : ''}
          </p>

          <div className="nav-elements">
            <ItemDropdown
              items={this.props.classrooms || [{ name: 'Please Add a Classroom', id: null, }]}
              callback={this.props.dropdownCallback}
              selectedItem={this.props.classrooms.find(cl => cl.id === Number(this.props.params.classroomId))}
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
