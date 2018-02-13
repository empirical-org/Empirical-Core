import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import Pluralize from 'pluralize';
import { connect } from 'react-redux';
import { toggleDropdown, hideDropdown, fetchStudentsClassrooms, handleClassroomClick, updateDefaultClassroomNumber }from '../../../../../actions/students_classrooms_header';

const StudentsClassroomsHeader = React.createClass({

  componentDidMount() {
    window.addEventListener('resize', this.updateDefaultClassroomNumber);
    this.updateDefaultClassroomNumber();
    this.props.fetchStudentsClassrooms();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDefaultClassroomNumber);
  },

  isActive(id, index) {
    let selectedClassroomId = this.props.studentsClassroomsHeader.selectedClassroomId ||
      this.props.currentClassroomId

    if (selectedClassroomId && id == selectedClassroomId.toString()) {
      return 'active';
    }
  },

  handleClassroomClick(classroomId) {
    if (!this.props.loading) {
      this.props.handleClassroomClick(classroomId);
      this.props.fetchData(classroomId);
    }
  },

  updateDefaultClassroomNumber() {
    this.props.updateDefaultClassroomNumber(window.innerWidth);
  },

  horizontalClassrooms() {
    // only shows the smaller of the defaultClassroomNumber classes or the total Classes
    const classroomBoxes = [];
    if (this.props.studentsClassroomsHeader.classrooms) {
      const maxNumber = Math.min(this.props.studentsClassroomsHeader.classrooms.length, this.props.studentsClassroomsHeader.defaultClassroomNumber);

      for (let i = 0; i < maxNumber; i++) {
        classroomBoxes.push(this.boxConstructor(this.props.studentsClassroomsHeader.classrooms[i], i));
      }
      const extraBoxCount = this.props.studentsClassroomsHeader.classrooms.length - this.props.studentsClassroomsHeader.defaultClassroomNumber;
      if (extraBoxCount > 0) {
        classroomBoxes.push(this.dropdownTab(extraBoxCount));
      }
      return classroomBoxes;
    }
  },

  verticalClassrooms() {
    if (this.props.studentsClassroomsHeader.showDropdownBoxes) {
      const classroomBoxes = [];
      if (this.props.studentsClassroomsHeader.classrooms) {
        for (let i = this.props.studentsClassroomsHeader.defaultClassroomNumber; i < this.props.studentsClassroomsHeader.classrooms.length; i++) {
          classroomBoxes.push(<li key={i}>{this.boxConstructor(this.props.studentsClassroomsHeader.classrooms[i], i)}</li>);
        }
        return classroomBoxes;
      }
    }
  },

  carat() {
    if (this.props.studentsClassroomsHeader.showDropdownBoxes) {
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
    updateDefaultClassroomNumber: (defaultClassroomNumber) => dispatch(updateDefaultClassroomNumber(defaultClassroomNumber))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsClassroomsHeader);
