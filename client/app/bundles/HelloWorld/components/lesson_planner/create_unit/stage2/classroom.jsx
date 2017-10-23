'use strict'

 import React from 'react'
 import $ from 'jquery'
 import Student from './student'
 import Button from 'react-bootstrap/lib/Button';
 import Panel from 'react-bootstrap/lib/Panel';
 import _ from 'underscore'

 export default React.createClass({

  componentDidMount: function(){
    $('body').scrollTop(0);
  },

  getInitialState: function(){
    return {open: false}
  },


  handleClassroomSelection: function(e) {
    var checked = $(e.target).is(':checked');
    this.props.toggleClassroomSelection(this.props.classroom, checked);
  },

  toggleClassroomCollapse: function() {
    this.setState({ open: !this.state.open });
  },

  determineCheckbox: function () {
    var allSelected;
    if (this.props.students.length > 0) {
      var selected = _.where(this.props.students, {isSelected: true});
      allSelected = (selected.length == this.props.students.length);
    } else {
      allSelected = this.props.allSelected;
    }
    return (
        <input type='checkbox'
               checked={allSelected ? 'checked' : null}
               className='css-checkbox classroom_checkbox'
               id={'classroom_checkbox_' + this.props.classroom.id}
               onChange={this.handleClassroomSelection} />
      );
  },

  angleIcon: function(){
    return this.state.open === true ? 'up' : 'down';
  },

  selectedStudentCount: function() {
    let selectedStudentCount = 0
    this.props.students.forEach((s) => {
      if (s.isSelected) {
        selectedStudentCount++
      }
    })
    return selectedStudentCount
  },

  renderStudentCountText: function() {
    const numberOfStudents = this.props.students.length
    const selectedStudentCount = this.selectedStudentCount()
    if (selectedStudentCount === 0) {
      return '(0 students will be assigned)'
    } else if (selectedStudentCount === numberOfStudents) {
      return `(All ${numberOfStudents} will be assigned)`
    } else {
      return `(${selectedStudentCount} out of ${numberOfStudents} students will be assigned)`
    }
  },

  render: function() {
    var studentList = this.props.students.map(function(student) {
      return <Student
                      key={`c${this.props.classroom.id}s${student.id}`}
                      student={student}
                      classroom={this.props.classroom}
                      handleStudentCheckboxClick={this.props.handleStudentCheckboxClick}
                      toggleStudentSelection={this.props.toggleStudentSelection}/>;
    }, this);

    return (
      <div className='panel-group'>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <h4 className='title'>
              <span>
                Select Entire Class
              </span>
              <Button className='toggle-button pull-right select-by-student-button' onClick={()=> this.setState({ open: !this.state.open })}>
                <span className='pull-right panel-select-by-student' >
                  Select by Student <i className={'fa fa-angle-' + this.angleIcon()}></i>
                </span>
              </Button>
              <div>
                {this.determineCheckbox()}
                <label className='css-label' htmlFor={'classroom_checkbox_' + this.props.classroom.id}>
                  {this.props.classroom.name}
                  <span style={{marginLeft: '5px', fontWeight: '600'}}>
                    {this.renderStudentCountText()}
                  </span>
                </label>
              </div>
            </h4>
          </div>
          <Panel collapsible expanded={this.state.open} ref='studentList'>
            <div className='panel-body'>
              {studentList}
            </div>
          </Panel>
        </div>
      </div>
    )
  }
});
