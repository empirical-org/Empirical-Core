import React from 'react';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx';
import NavButtonGroup from './nav_button_group.jsx';
import StudentDropdown from '../../general_components/dropdown_selectors/student_dropdown.jsx';
import blackIconAppName from '../../modules/get_black_icon_app_name_from_classification.js'
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'
import l from 'lodash'
import $ from 'jquery';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }

  UNSAFE_componentWillMount() {
    fetch(`${process.env.DEFAULT_URL}/teachers/progress_reports/diagnostic_activity_ids`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      const diagnosticActivityIds = response.diagnosticActivityIds
      const activityId = Number(this.props.params.activityId)
      if (diagnosticActivityIds.includes(activityId)) {
        $('.activity-analysis-tab').removeClass('active');
        $('.diagnostic-tab').addClass('active');
      } else {
        $('.diagnostic-tab').removeClass('active');
        $('.activity-analysis-tab').addClass('active');
      }
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  }

  getStudentDropdownOptions = () => {
    return this.students().map(student => ({ label: student.name, value: student }))
  }

  studentDropdown = () => {
    const { params, showStudentDropdown, studentDropdownCallback } = this.props
    const { studentId } = params
    let selectedStudent;
    if (studentId) {
      selectedStudent = this.getStudentDropdownOptions().find(student => student.value.id === Number(studentId));
    }
    if (showStudentDropdown) {
      return (<DropdownInput
        className="student-dropdown"
        handleChange={studentDropdownCallback}
        options={this.getStudentDropdownOptions()}
        value={selectedStudent}
      />);
    }
  };

  students = () => {
    const selectedClassroomId = parseInt(this.props.params.classroomId);
    let students
    if (this.props.students) {
      students = this.props.students;
    } else if (selectedClassroomId) {
      students = this.props.classrooms.find(cl => cl.id === selectedClassroomId).students || null;
    } else if (this.props.classrooms) {
      students = this.props.classrooms[0].students;
    }
    return students.sort((a, b) => {
      const aLastName = a.name.split(' ')[1]
      const bLastName = b.name.split(' ')[1]
      if (aLastName > bLastName) {
        return 1
      } else if (aLastName < bLastName) {
        return -1
      } else {
        return 0
      }
    })
  };

  render() {
    let appName, image, previewLink
    if (l.has(this.props.selectedActivity, 'classification.id')) {
      appName = blackIconAppName(this.props.selectedActivity.classification.id)
      image = <img alt={`${appName}-icon`} src={`https://assets.quill.org/images/icons/${appName}-black.svg`} />
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
            <img alt="info-icon" src='https://assets.quill.org/images/icons/info-black.svg' />
            {this.props.selectedActivity.description}
          </p>

          <p className='standard'>
            <img alt="common-core-icon" src='https://assets.quill.org/images/icons/common-core-gray.svg' />
            {this.props.selectedActivity && this.props.selectedActivity.topic ? this.props.selectedActivity.topic.name : ''}
          </p>
          <div className="nav-elements">
            <ItemDropdown
              callback={this.props.dropdownCallback}
              items={this.props.classrooms || [{ name: 'Please Add a Classroom', id: null, }]}
              selectedItem={this.props.classrooms.find(cl => cl.id === Number(this.props.params.classroomId))}
            />
            <NavButtonGroup
              clickCallback={this.props.buttonGroupCallback}
              params={this.props.params}
            />     
            {this.studentDropdown()}
          </div>
        </div>
      </div>
    );
  }
};
