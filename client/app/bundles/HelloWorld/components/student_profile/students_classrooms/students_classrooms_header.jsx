import React from 'react';
import Pluralize from 'pluralize';
import { connect } from 'react-redux';
import { toggleDropdown, hideDropdown, fetchStudentsClassrooms, fetchStudentProfile, handleClassroomClick } from '../../../../../actions/student_profile';

const StudentsClassroomsHeader = React.createClass({

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.props.screenResize(window.innerWidth);
    });
    this.props.fetchStudentsClassrooms();
  },

  componentWillUnmount() {
    window.removeEventListener('resize');
  },

  isActive(id, index) {
    let selectedClassroomId = this.props.selectedClassroomId ||
      this.props.student.classroom.id

    if (selectedClassroomId && id == selectedClassroomId.toString()) {
      return 'active';
    }
  },

  handleClassroomClick(classroomId) {
    if (!this.props.loading) {
      this.props.handleClassroomClick(classroomId);
      this.props.fetchStudentProfile(classroomId);
    }
  },

  horizontalClassrooms() {
    const classroomBoxes = [];
    if (this.props.classrooms) {
      const maxNumber = Math.min(this.props.classrooms.length, this.props.classroomDisplayNumber);

      for (let i = 0; i < maxNumber; i++) {
        classroomBoxes.push(this.boxConstructor(this.props.classrooms[i], i));
      }
      const extraBoxCount = this.props.classrooms.length - this.props.classroomDisplayNumber;
      if (extraBoxCount > 0) {
        classroomBoxes.push(this.dropdownTab(extraBoxCount));
      }
      return classroomBoxes;
    }
  },

  verticalClassrooms() {
    if (this.props.showDropdownBoxes) {
      const classroomBoxes = [];
      if (this.props.classrooms) {
        for (let i = this.props.classroomDisplayNumber; i < this.props.classrooms.length; i++) {
          classroomBoxes.push(<li key={i}>{this.boxConstructor(this.props.classrooms[i], i)}</li>);
        }
        return classroomBoxes;
      }
    }
  },

  carat() {
    if (this.props.showDropdownBoxes) {
      return <i className="fa fa-angle-up" />;
    }

    return <i className="fa fa-angle-down" />;
  },

  dropdownTab(extraBoxCount) {
    return (<div className="classroom-box dropdown-tab" onClick={this.props.toggleDropdown} tabIndex="0" onBlur={this.props.hideDropdownBoxes}>
      <p>{extraBoxCount} More {Pluralize('Class', extraBoxCount)}{this.carat()}</p>
      <ul className="dropdown-classrooms">
        {this.verticalClassrooms()}
      </ul>
    </div>);
  },

  boxConstructor(classroom, index) {
    return (
      <div
        className={`${this.isActive(classroom.id, index)} classroom-box`}
        key={classroom.id}
        onClick={() => this.handleClassroomClick(classroom.id)}
      >
        <div>{classroom.teacher}</div>
        <div className="classroom-box-classroom">{classroom.name}</div>
      </div>
    );
  },

  render() {
    return (
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="pull-right student-course-info">
            <div>{this.horizontalClassrooms()}</div>
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
    screenResize: (screenWidth) => dispatch(screenResize(screenWidth)),
    fetchStudentProfile: (classroomId) => dispatch(fetchStudentProfile(classroomId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsClassroomsHeader);
