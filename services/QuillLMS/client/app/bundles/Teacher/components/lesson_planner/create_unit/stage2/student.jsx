'use strict'

 import React from 'react'
 import $ from 'jquery'

 export default  React.createClass({

  handleStudentSelection: function(e) {
    const checked = $(e.target).is(':checked');
    if (this.props.toggleStudentSelection) {
      // TODO: As of 1/27/17 this is used when a unit is being created.
      // Ultimately it should be chnaged to the handleStudentCheckboxClick
      // The source of handleStudentCheckboxClick can be found in ClassroomsWithStudentsContainer
      // and is being used to update students on edit.
      this.props.toggleStudentSelection(this.props.student, this.props.classroom, checked);
    } else {
      this.props.handleStudentCheckboxClick(this.props.student.id, this.props.classroom.id)
    }
  },

  determineCheckbox: function () {
    // TODO: rewrite this method to make checked a variable, nothing else changes
    if (this.props.student.isSelected == true) {
      return ( <input type="checkbox"
                     checked="checked"
                     className="css-checkbox"
                     id={'student_' + this.props.student.id + 'classroom_' + this.props.classroom.id}
                     onChange={this.handleStudentSelection} />
      );
    } else {
      return (<input type="checkbox"
                     className="css-checkbox"
                     id={'student_' + this.props.student.id + 'classroom_' + this.props.classroom.id}
                     onChange={this.handleStudentSelection} />
      );
    }
  },

  render: function() {
    return (
      <div className="student">
        {this.determineCheckbox()}
        <label htmlFor={'student_' + this.props.student.id + 'classroom_' + this.props.classroom.id} className="css-label">{this.props.student.name}</label>
      </div>
    );
  }
});
