import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import Pluralize from 'pluralize';

export default React.createClass({

  getInitialState() {
    return {
      classrooms: null,
      selectedClassroomId: this.props.currentClassroomId,
      switchingClassrooms: false,
      showDropdownBoxes: false,
      defaultClassroomNumber: 1,
    };
  },

  componentDidMount() {
    window.addEventListener('resize', this.updateDefaultClassroomNumber);
    this.updateDefaultClassroomNumber();
    $.ajax({ url: '/students_classrooms_json', format: 'json', success: this.updateClassrooms, });
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDefaultClassroomNumber);
  },

  updateClassrooms(data) {
    this.setState({ classrooms: data.classrooms, });
  },

  isActive(id, index) {
    if (this.state.selectedClassroomId && id == this.state.selectedClassroomId.toString()) {
      return 'active';
    }
  },

  handleClassroomClick(classroomId) {
    if (!this.props.loading) {
      this.setState({ selectedClassroomId: classroomId, });
      this.props.fetchData(classroomId);
    }
  },

  updateDefaultClassroomNumber() {
    const defaultClassroomNumber = window.innerWidth > 1000 ? 5 : 1;
    this.setState({ defaultClassroomNumber, });
  },

  horizontalClassrooms() {
    // only shows the smaller of the defaultClassroomNumber classes or the total Classes
    const classroomBoxes = [];
    if (this.state.classrooms) {
      const maxNumber = Math.min(this.state.classrooms.length, this.state.defaultClassroomNumber);

      for (let i = 0; i < maxNumber; i++) {
        classroomBoxes.push(this.boxConstructor(this.state.classrooms[i], i));
      }
      const extraBoxCount = this.state.classrooms.length - this.state.defaultClassroomNumber;
      if (extraBoxCount > 0) {
        classroomBoxes.push(this.dropdownTab(extraBoxCount));
      }
      return classroomBoxes;
    }
  },

  verticalClassrooms() {
    if (this.state.showDropdownBoxes) {
      const classroomBoxes = [];
      if (this.state.classrooms) {
        for (let i = this.state.defaultClassroomNumber; i < this.state.classrooms.length; i++) {
          classroomBoxes.push(<li key={i}>{this.boxConstructor(this.state.classrooms[i], i)}</li>);
        }
        return classroomBoxes;
      }
    }
  },

  toggleDropdown() {
    this.setState({
      showDropdownBoxes: !this.state.showDropdownBoxes,
    });
  },

  hideDropdownBoxes(data) {
    this.setState({ showDropdownBoxes: false, });
  },

  dropdownTab(extraBoxCount) {
    const carat = this.state.showDropdownBoxes ? <i className="fa fa-angle-up" /> : <i className="fa fa-angle-down" />;
    return (<div className="classroom-box dropdown-tab" onClick={this.toggleDropdown} tabIndex="0" onBlur={this.hideDropdownBoxes}>
      <p>{extraBoxCount} More {Pluralize('Class', extraBoxCount)}{carat}</p>
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
