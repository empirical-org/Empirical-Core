'use strict'
import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Pluralize from 'pluralize'

export default React.createClass({

  getInitialState: function() {
    return {
      classrooms: null,
      selectedClassroomId: this.props.currentClassroomId,
      switchingClassrooms: false,
      showDropdownBoxes: false,
      defaultClassroomNumber: 1
    }
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.updateDefaultClassroomNumber);
    this.updateDefaultClassroomNumber()
    $.ajax({url: '/students_classrooms_json', format: 'json', success: this.updateClassrooms})
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.updateDefaultClassroomNumber);
  },

  updateClassrooms: function(data) {
    this.setState({classrooms: data.classrooms})
  },

  isActive: function(id, index) {
    if (id === this.state.selectedClassroomId) {
     return 'active';
    }
  },

  handleClassroomClick: function(classroomId) {
    if (!this.props.loading) {
      this.setState({ selectedClassroomId: classroomId })
      this.props.fetchData(classroomId)
    }
  },

  updateDefaultClassroomNumber: function() {
    const defaultClassroomNumber = window.innerWidth > 1000 ? 5 : 1
    this.setState({defaultClassroomNumber})
  },

  horizontalClassrooms: function() {
    // only shows the smaller of the defaultClassroomNumber classes or the total Classes
    const classroomBoxes = [];
    if (this.state.classrooms) {
      const maxNumber = Math.min(this.state.classrooms.length, this.state.defaultClassroomNumber)

      for (let i = 0; i < maxNumber; i++) {
        classroomBoxes.push(this.boxConstructor(this.state.classrooms[i], i))
      }
      const extraBoxCount = this.state.classrooms.length - this.state.defaultClassroomNumber
      if (extraBoxCount > 0) {
        classroomBoxes.push(this.dropdownTab(extraBoxCount))
      }
      return classroomBoxes
    }
  },

  verticalClassrooms: function() {
    if (this.state.showDropdownBoxes) {
      const classroomBoxes = [];
      if (this.state.classrooms) {
        for (let i = this.state.defaultClassroomNumber; i < this.state.classrooms.length; i++) {
          classroomBoxes.push(<li key={i}>{this.boxConstructor(this.state.classrooms[i], i)}</li>)
        }
      return classroomBoxes
    }}
  },

  toggleDropdown: function() {
    this.setState({
      showDropdownBoxes: !this.state.showDropdownBoxes
    })
  },

  hideDropdownBoxes: function(data) {
    this.setState({showDropdownBoxes: false})
  },

  dropdownTab: function(extraBoxCount) {
    const carat = this.state.showDropdownBoxes ? <i className="fa fa-angle-up"/> : <i className="fa fa-angle-down"/>
    return <div className='classroom-box dropdown-tab' onClick={this.toggleDropdown} tabIndex="0" onBlur={this.hideDropdownBoxes}>
      <p>{extraBoxCount} More {Pluralize('Class', extraBoxCount)}{carat}</p>
      <ul className='dropdown-classrooms'>
        {this.verticalClassrooms()}
      </ul>
    </div>
  },

  boxConstructor: function(classroom, index) {
    return (
      <div
        className={this.isActive(classroom.id, index) + ' classroom-box'}
        key={classroom.id}
        onClick={() => this.handleClassroomClick(classroom.id)}>
        <div>{classroom.teacher}</div>
        <div className="classroom-box-classroom">{classroom.name}</div>
      </div>
    )
  },

  render: function() {
    return(
        <div className="tab-subnavigation-wrapper student-subnavigation">
          <div className="container">
            <span className="pull-right student-course-info">
              <div>{this.horizontalClassrooms()}</div>
            </span>
          </div>
        </div>
    )
  }

})
