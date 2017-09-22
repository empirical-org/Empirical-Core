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
