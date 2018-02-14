import React from 'react';
import Pluralize from 'pluralize';
import { connect } from 'react-redux';
import StudentsClassroom from './students_classroom';
import StudentsClassroomsTabs from './students_classrooms_tabs.jsx';
import StudentsClassroomsDropdown from './students_classrooms_dropdown.jsx'

import { toggleDropdown, hideDropdown, fetchStudentsClassrooms, fetchStudentProfile, handleClassroomClick, updateNumberOfClassroomTabs} from '../../../../../actions/student_profile';

const StudentsClassroomsHeader = React.createClass({

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.props.updateNumberOfClassroomTabs(window.innerWidth);
    });
    this.props.updateNumberOfClassroomTabs(window.innerWidth);
    this.props.fetchStudentsClassrooms();
  },

  componentWillUnmount() {
    window.removeEventListener('resize');
  },

  handleClassroomClick(classroomId) {
    if (!this.props.loading) {
      this.props.handleClassroomClick(classroomId);
      this.props.fetchStudentProfile(classroomId);
    }
  },

  render() {
    return (
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="pull-right student-course-info">
            <StudentsClassroomsTabs
              classrooms={this.props.classrooms}
              numberOfClassroomTabs={this.props.numberOfClassroomTabs}
              selectedClassroomId={this.props.selectedClassroomId || this.props.student.classroom.id}
              handleClick={this.handleClassroomClick}
              hideDropdownBoxes={this.props.hideDropdown}
              toggleDropdown={this.props.toggleDropdown}
              showDropdown={this.props.showDropdown}
            />
          </span>
        </div>
      </div>
    );
  },
});

const mapStateToProps = (state) => { return state }
const mapDispatchToProps = (dispatch) => {
  return {
    toggleDropdown: () => dispatch(toggleDropdown()),
    hideDropdown: () => dispatch(hideDropdown()),
    fetchStudentsClassrooms: () => dispatch(fetchStudentsClassrooms()),
    handleClassroomClick: (classroomId) => dispatch(handleClassroomClick(classroomId)),
    updateNumberOfClassroomTabs: (screenWidth) => dispatch(updateNumberOfClassroomTabs(screenWidth)),
    fetchStudentProfile: (classroomId) => dispatch(fetchStudentProfile(classroomId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsClassroomsHeader);
