import React from 'react';
import Pluralize from 'pluralize';
import { connect } from 'react-redux';
import StudentsClassroom from './students_classroom';
import StudentsClassroomsTabs from './students_classrooms_tabs.jsx';
import StudentsClassroomsDropdown from './students_classrooms_dropdown.jsx'

import { toggleDropdown, hideDropdown, fetchStudentProfile } from '../../../../../actions/student_profile';

const StudentsClassroomsHeader = React.createClass({

  render() {
    return (
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="pull-right student-course-info">
            <StudentsClassroomsTabs
              classrooms={this.props.classrooms}
              numberOfClassroomTabs={this.props.numberOfClassroomTabs}
              selectedClassroomId={this.props.selectedClassroomId || this.props.student.classroom.id}
              handleClick={this.props.handleClassroomTabClick}
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
    fetchStudentProfile: (classroomId) => dispatch(fetchStudentProfile(classroomId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsClassroomsHeader);
